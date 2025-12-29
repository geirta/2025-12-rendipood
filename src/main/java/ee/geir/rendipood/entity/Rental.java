package ee.geir.rendipood.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double initialFee;
    private double lateFee;

    @OneToMany(mappedBy = "rental", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<RentalFilm> rentalFilms;

    private boolean complete;

}
