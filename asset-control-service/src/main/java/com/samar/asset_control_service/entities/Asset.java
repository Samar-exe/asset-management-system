package com.samar.asset_control_service.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String assetName;
    private LocalDate purchaseDate;
    @Column(nullable = false)
    private String assetStatus;

    public Asset(String assetName, LocalDate purchaseDate, String assetStatus) {
        this.assetName = assetName;
        this.purchaseDate = purchaseDate;
        this.assetStatus = assetStatus;
    }

    public Asset() {
    }

    public UUID getId() {
        return id;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getAssetStatus() {
        return assetStatus;
    }

    public void setAssetStatus(String assetStatus) {
        this.assetStatus = assetStatus;
    }
}
