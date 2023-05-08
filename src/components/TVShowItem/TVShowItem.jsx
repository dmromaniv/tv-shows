import { checkData } from "@/helpers/checkData";
import styles from "./TvShowItem.module.scss";

/* eslint-disable */
function TvShowItem({ name, rating, image }) {
  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={
          image?.medium ||
          "https://cdn.pixabay.com/photo/2017/10/06/11/09/tile-2822716_960_720.jpg"
        }
        alt={name}
      />
      <p className={styles.ratings}>
        Ratings: <span>{checkData(rating.average)}</span>
      </p>
      <div className={styles.textContent}>
        <p className={styles.name}>{checkData(name)}</p>
      </div>
    </div>
  );
}

export default TvShowItem;
