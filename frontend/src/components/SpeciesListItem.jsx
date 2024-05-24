import styles from "./SpeciesListItem.module.css";

/**
 * Displays info about a particular species in a <li>.
 */
export default function SpeciesListItem({ species }) {
  const { name, dexNumber, dexEntry, image } = species;

  return (
    <li>
      <h3>
        {name} <em>(#{dexNumber})</em>
      </h3>
      <img src={image} alt={name} />
      <p>{dexEntry}</p>
    </li>
  );
}
