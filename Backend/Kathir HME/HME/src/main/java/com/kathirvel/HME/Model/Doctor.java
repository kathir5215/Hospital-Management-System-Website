    package com.kathirvel.HME.Model;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.ToString;

    import java.util.List;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "doctordetails")
    public class Doctor {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        private String name;

        private String phone;

        private String gender;

        private String available;

        @ManyToOne(fetch = FetchType.LAZY)
        private User user;

        @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference("doctor-appointments")
        private List<Appointment> appointments;

        @OneToMany(mappedBy = "doctor")
        @JsonIgnore
        private List<Prescription> prescriptions;
        // getters/setters or lombok @Data annotation
    }
