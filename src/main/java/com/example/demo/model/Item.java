package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name_kg;
    private String name_en;

    @Lob
    private String description_kg;

    @Lob
    private String description_en;

    private Double price;

    @Lob
    private String image_url;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties("items")
    private Category category;

    public Integer getId() { return id; }

    public String getName_kg() { return name_kg; }
    public void setName_kg(String name_kg) { this.name_kg = name_kg; }

    public String getName_en() { return name_en; }
    public void setName_en(String name_en) { this.name_en = name_en; }

    public String getDescription_kg() { return description_kg; }
    public void setDescription_kg(String description_kg) { this.description_kg = description_kg; }

    public String getDescription_en() { return description_en; }
    public void setDescription_en(String description_en) { this.description_en = description_en; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
