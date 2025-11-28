package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name_kg;
    private String name_en;
    private String name_ru;

    @Lob
    private String image_url;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("category")
    private List<Item> items;

    public Integer getId() { return id; }

    public String getName_kg() { return name_kg; }
    public void setName_kg(String name_kg) { this.name_kg = name_kg; }

    public String getName_en() { return name_en; }
    public void setName_en(String name_en) { this.name_en = name_en; }

    public String getName_ru() { return name_ru; }
    public void setName_ru(String name_ru) { this.name_ru = name_ru; }

    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
