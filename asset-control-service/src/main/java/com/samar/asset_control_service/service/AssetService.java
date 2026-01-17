package com.samar.asset_control_service.service;

import com.samar.asset_control_service.entities.Asset;
import com.samar.asset_control_service.entities.AuditLog;
import com.samar.asset_control_service.repository.AssetRepo;
import com.samar.asset_control_service.repository.AuditLogRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AssetService {
    private final AssetRepo assetRepo;
    private final AuditLogRepo auditLogRepo;

    public AssetService(AssetRepo assetRepo, AuditLogRepo auditLogRepo) {
        this.assetRepo = assetRepo;
        this.auditLogRepo = auditLogRepo;
    }

    @Transactional
    public Asset addAsset(Asset asset) {
        Asset savedAsset = assetRepo.save(asset);
        String logMessage = "Saved asset " + savedAsset.getAssetName();
        logChange(savedAsset.getId(), logMessage, "ADD");
        return savedAsset;
    }

    public Asset findAssetById(UUID id) {
        return assetRepo.findById(id).orElseThrow(() -> new RuntimeException("Asset Not Found"));
    }

    @Transactional
    public void deleteAsset(UUID id) {
        Asset asset = this.findAssetById(id);
        String logMessage = "Delete Asset " + asset.getAssetName();
        assetRepo.deleteById(id);

        logChange(asset.getId(), logMessage, "DELETE");
    }

    public List<Asset> findAll() {
        return assetRepo.findAll();
    }

    @Transactional
    public Asset updateAsset(UUID id, Asset assetDetails) {

        // Find the already existing asset.
        Asset existingAsset = assetRepo.findById(id).orElseThrow(() -> new RuntimeException("Asset Not Found"));

        // Name for logging purposes.
        String oldName = existingAsset.getAssetName();
        String newName = assetDetails.getAssetName();
        String oldStatus = existingAsset.getAssetStatus();
        String newStatus = assetDetails.getAssetStatus();
        String oldDate = existingAsset.getPurchaseDate().toString();
        String newDate = assetDetails.getPurchaseDate().toString();

        String logMessage = String.format("Name: %s -> %s\nStatus: %s -> %s\nPurchase Date: %s -> %s", oldName, newName, oldStatus, newStatus, oldDate, newDate);

        // Update Asset Information.
        existingAsset.setAssetName(assetDetails.getAssetName());
        existingAsset.setAssetStatus(assetDetails.getAssetStatus());
        existingAsset.setPurchaseDate(assetDetails.getPurchaseDate());

        // Save updated Asset.
        Asset updatedAsset = this.assetRepo.save(existingAsset);

        // Logging the change.
        logChange(updatedAsset.getId(), logMessage, "UPDATE");

        return updatedAsset;
    }

    public List<AuditLog> getAuditLogs(UUID assetId) {
	    return auditLogRepo.findByAssetId(assetId); 
    }
    public List<Asset> searchAssets(String keyword) {
	    return assetRepo.findByAssetNameContainingIgnoreCase(keyword);
    }

    private void logChange(UUID assetId, String logMessage, String action) {
        AuditLog log = new AuditLog();
        log.setLogDetails(logMessage);
        log.setAssetId(assetId);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        this.auditLogRepo.save(log);
    }
}
