import { useRef, useState } from "react";

import Card from "../ui/Card";
import Button from "../ui/Button";

import useBackup from "../../hooks/useBackup";
import RestoreConfirmModal from "../restore/RestoreConfirmModal";

import "./BackupCard.css";

function BackupCard() {
  const fileInputRef = useRef(null);

  const { loading, exportBackup, preview, restore } = useBackup();

  const [previewData, setPreviewData] = useState(null);

  const [backupJson, setBackupJson] = useState(null);

  const [restoreModalOpen, setRestoreModalOpen] = useState(false);

  const [error, setError] = useState("");

  const handleDownload = async () => {
    try {
      setError("");

      const blob = await exportBackup();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `AME_Backup_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")}.json`;

      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Backup download failed.",
      );
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (event) => {
    try {
      setError("");
      setPreviewData(null);

      const file = event.target.files[0];

      if (!file) return;

      const text = await file.text();

      const json = JSON.parse(text);
      setBackupJson(json);

      const data = await preview(json);

      setPreviewData(data);
    } catch (err) {
      setPreviewData(null);
      setBackupJson(null);

      setError(
        err.response?.data?.message || err.message || "Invalid backup file.",
      );
    }
  };

  return (
    <Card title="Backup & Restore">
      <div className="backup-card">
        <div className="backup-buttons">
          <Button onClick={handleDownload} disabled={loading}>
            Download Backup
          </Button>

          <Button
            variant="secondary"
            onClick={handleChooseFile}
            disabled={loading}
          >
            Select Backup File
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            hidden
            onChange={handleFile}
          />
        </div>

        {error && <div className="backup-error">{error}</div>}

        {previewData && (
          <div className="backup-preview">
            <h4>Backup Preview</h4>

            <p>
              <strong>Version :</strong> {previewData.manifest.version}
            </p>

            <p>
              <strong>Date :</strong>{" "}
              {new Date(previewData.manifest.backupDate).toLocaleString()}
            </p>

            <p>
              <strong>Customers :</strong> {previewData.summary.customers}
            </p>

            <p>
              <strong>Products :</strong> {previewData.summary.products}
            </p>

            <p>
              <strong>Bills :</strong> {previewData.summary.bills}
            </p>

            <p>
              <strong>Ledger :</strong> {previewData.summary.ledger}
            </p>

            <Button
              variant="danger"
              onClick={() => setRestoreModalOpen(true)}
              disabled={!previewData || loading}
            >
              Restore Database
            </Button>
          </div>
        )}
      </div>

      <RestoreConfirmModal
        open={restoreModalOpen}
        loading={loading}
        backupInfo={previewData}
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={async () => {
          await restore({
            confirmation: "RESTORE DATABASE",
            backup: backupJson,
          });

          alert("Database restored successfully.");

          setRestoreModalOpen(false);

          setPreviewData(null);

          setBackupJson(null);
        }}
      />
    </Card>
  );
}

export default BackupCard;
