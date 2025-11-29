package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String password;

    public Admin() {}

    public Admin(String login, String password) {
        this.login = login;
        this.password = password;
    }

    public Integer getId() { return id; }
    public String getLogin() { return login; }
    public String getPassword() { return password; }

    public void setId(Integer id) { this.id = id; }
    public void setLogin(String login) { this.login = login; }
    public void setPassword(String password) { this.password = password; }
}
