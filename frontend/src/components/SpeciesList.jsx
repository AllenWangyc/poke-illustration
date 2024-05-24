import SpeciesListItem from "./SpeciesListItem";
import styles from "./SpeciesList.module.css";

/**
 * Displays the given array of species as an <ul> with a number of <SpeciesListItem>s.
 */
export default function SpeciesList({ species }) {
  return (
    <ul className={styles.list}>
      {species.map((s) => (
        <li key={s.dexNumber} className={styles['list-item-container']}>
          <SpeciesListItem species={s} />
        </li>
      ))}
    </ul>
  );
}
