import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  castCountSelector,
  heightTotalSelector,
  castStatus,
  filterCast,
  selectCast,
  sortCast,
} from "./castSlice";
import "./Cast.css";

export function Cast() {
  const castCount = useSelector(castCountSelector);
  const [heightTotalInCM, heightTotalInInches, heightTotalInFt] = useSelector(
    heightTotalSelector
  );
  const cast = useSelector(selectCast);
  const loadingCast = useSelector(castStatus);
  const dispatch = useDispatch();

  if (!cast.length) return null;

  return (
    <>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>
              <span>Filter By Gender</span>
              <select
                onChange={(e) => {
                  dispatch(filterCast({ by: "gender", val: e.target.value }));
                }}
              >
                {[
                  ["All", "all"],
                  ["Male", "male"],
                  ["Female", "female"],
                ].map(([text, value], index) => (
                  <option value={value} key={index}>
                    {text}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th onClick={() => dispatch(sortCast("name"))}>Name</th>
            <th>Gender</th>
            <th onClick={() => dispatch(sortCast("height"))}>Height</th>
          </tr>
        </thead>
        <tbody>
          {cast.map((actor, index) => (
            <tr key={index}>
              <td>{actor.name}</td>
              <td>
                {actor.gender === "male"
                  ? "♂"
                  : actor.gender === "female"
                  ? "♀"
                  : "-"}
              </td>
              <td>{isNaN(actor.height) ? "-" : actor.height}</td>
            </tr>
          ))}
          <tr>
            <td>Number of Actors: {castCount}</td>
            <td colSpan={2}>
              Total Cast Height: {heightTotalInCM}cm ({heightTotalInFt}ft/
              {heightTotalInInches}in)
            </td>
          </tr>
        </tbody>
        <tfoot>
          {loadingCast ? (
            <tr>
              <td colSpan={3}>Loading...</td>
            </tr>
          ) : null}
        </tfoot>
      </table>
    </>
  );
}
