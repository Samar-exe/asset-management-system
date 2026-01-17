package com.samar.asset_control_service.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID logId;
    @Column(nullable = false)
    private UUID assetId;
    private String logDetails;
    private LocalDateTime timestamp;
    @Column(nullable = false)
    private String action;


    public AuditLog(UUID assetId, String logDetails, LocalDateTime timestamp, String action) {
        this.assetId = assetId;
        this.logDetails = logDetails;
        this.timestamp = timestamp;
        this.action = action;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public AuditLog() {
    }

    public UUID getLogId() {
        return logId;
    }

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public String getLogDetails() {
        return logDetails;
    }

    public void setLogDetails(String logDetails) {
        this.logDetails = logDetails;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
