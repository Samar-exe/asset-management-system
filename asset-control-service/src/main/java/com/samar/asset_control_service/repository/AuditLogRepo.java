package com.samar.asset_control_service.repository;

import com.samar.asset_control_service.entities.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.UUID;

@Repository
public interface AuditLogRepo extends JpaRepository<AuditLog, UUID> {
	List<AuditLog> findByAssetId(UUID assetId);
}
