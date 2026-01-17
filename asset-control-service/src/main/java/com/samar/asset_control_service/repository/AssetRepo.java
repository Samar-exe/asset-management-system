package com.samar.asset_control_service.repository;

import com.samar.asset_control_service.entities.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface AssetRepo extends JpaRepository<Asset, UUID> {
	List<Asset> findByAssetNameContainingIgnoreCase(String keyword);
}
