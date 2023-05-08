import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";

import { fetchTVShowById } from "@/services/tvmazeAPI";
import { selectTvShows } from "@/redux/selectors";
import { checkData } from "@/helpers/checkData";

import Error from "../Error/";
import Loader from "../Loader";
import styles from "./TvShowDetail.module.scss";

function TVShowDetail() {
  const { id } = useParams();
  const tvShows = useSelector(selectTvShows);

  const [tvShowInfo, setTvShowInfo] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);
  const [isError, setErrorStatus] = useState(false);

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
              <td className={styles.tData}>{checkData(name)}</td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Genres</th>
              <td className={styles.tData}>{checkData(genres)}</td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Rating</th>
              <td className={styles.tData}>{checkData(rating.average)}</td>
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
              <td className={styles.tData}>{checkData(status)}</td>
            </tr>
            <tr>
              <th className={styles.tHeading}>Schedule</th>
              <td className={styles.tData}>
                <span className={styles.scheduleDays}>
                  {checkData(schedule.days)}
                </span>
                {schedule.time && (
                  <span className={styles.scheduleTime}>{schedule.time}</span>
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
