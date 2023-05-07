import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";

import { fetchTVShowById } from "@/services/tvmazeAPI";
import { selectTvShows } from "@/redux/selectors";
import { routes } from "@/helpers/routes";

import Error from "../Error/";
import Loader from "../Loader";
import styles from "./TvShowDetail.module.scss";
import "animate.css";

function TVShowDetail() {
  const { id } = useParams();
  const [tvShowInfo, setTvShowInfo] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);
  const [isError, setErrorStatus] = useState(false);
  const tvShows = useSelector(selectTvShows);

  useEffect(() => {
    (async () => {
      if (tvShows) {
        const { show } = tvShows.find(({ show }) => show.id === +id);
        setTvShowInfo(show);
      } else {
        try {
          setLoadingStatus(true);
          const response = await fetchTVShowById(id);
          setTvShowInfo(response.data);
          setErrorStatus(false);
        } catch (error) {
          setErrorStatus(true);
        } finally {
          setLoadingStatus(false);
        }
      }
    })();
  }, [id, tvShows]);

  if (isError) {
    return (
      <>
        <Error />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  if (tvShowInfo) {
    const { name, image, summary, genres, rating, status, schedule } =
      tvShowInfo;

    return (
      <div className={styles.detailsContent}>
        <Link to="/">Go back</Link>
        <div
          className={`${styles.imgWrapper} animate__animated animate__pulse`}
        >
          <img
            className={styles.image}
            src={
              image
                ? image.original
                : "https://cdn.pixabay.com/photo/2017/10/06/11/09/tile-2822716_960_720.jpg"
            }
            alt={name}
          />
          <div className={styles.summaryWrapper}>
            {summary ? parse(summary) : "no available info"}
          </div>
        </div>

        <table className={styles.table}>
          <tbody>
            <tr>
              <th className={styles.tHeading}>Name</th>
              <td className={styles.tData}>{name}</td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Genres</th>
              <td className={styles.tData}>
                {genres.length > 0 ? genres.join(", ") : "no info"}
              </td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Rating</th>
              <td className={styles.tData}>{rating.average || "no info"}</td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Link</th>
              <td className={styles.tData}>
                <a
                  className={styles.link}
                  href={tvShowInfo.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {name}
                </a>
              </td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Status</th>
              <td className={styles.tData}>{status}</td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Schedule</th>
              <td className={styles.tData}>
                {schedule.days.length !== 0 ? (
                  <>
                    <span className={styles.scheduleDays}>
                      {schedule.days.join(", ")}
                    </span>
                    <span className={styles.scheduleTime}>{schedule.time}</span>
                  </>
                ) : (
                  "no info"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TVShowDetail;
