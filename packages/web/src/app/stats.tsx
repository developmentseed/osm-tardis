import { useState } from "preact/hooks";
import type { Stats } from "./map/utils";

interface StatsProps {
  stats: Stats;
  loading: boolean;
  currentTimestamp?: string;
}

export function Stats(props: StatsProps) {
  const { stats, loading, currentTimestamp } = props;
  const [expandedUsers, setExpandedUsers] = useState(false);
  const [expandedTags, setExpandedTags] = useState(false);

  if (loading || !stats) {
    return (
      <article class="stats">
        <div class="stats__heading">
          <h2>Results</h2>
          <p class="loading" />
        </div>
        <section>
          <h3>Feature Stats</h3>
          <ul class="bar-chart">
            <li class="bar-chart__bar">
              <span class="loading" />
              <span class="loading" />
              <span class="loading" />
              <span class="loading" />
            </li>
            <li class="bar-chart__bar">
              <span class="loading" />
              <span class="loading" />
              <span class="loading" />
              <span class="loading" />
            </li>
            <li class="bar-chart__bar">
              <span class="loading" />
              <span class="loading" />
              <span class="loading" />
              <span class="loading" />
            </li>
          </ul>
          <table class="loading__wrapper">
            <thead>
              <tr>
                <th>Feature</th>
                <th><span class="feature--label feature--label__add">Added</span></th>
                <th><span class="feature--label feature--label__mod">Modified</span></th>
                <th><span class="feature--label feature--label__del">Deleted</span></th>
              </tr>
            </thead>
            <tbody>
              {Array.from(Array(3).keys()).map((x) => {
                return (
                  <tr key={x}>
                    <td class="loading" />
                    <td class="loading" />
                    <td class="loading" />
                    <td class="loading" />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <section>
          <h3>User Stats</h3>
          <table class="loading__wrapper">
            <thead>
              <tr>
                <th>User</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(Array(5).keys()).map((x) => {
                return (
                  <tr key={x}>
                    <td class="loading" />
                    <td class="loading" />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <section>
          <h3>Tag Stats</h3>
          <table class="loading__wrapper">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(Array(12).keys()).map((x) => {
                return (
                  <tr key={x}>
                    <td class="loading" />
                    <td class="loading" />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </article>
    );
  }

  const sortedUsers: [string, number][] = [];
  const sortedTags: [string, number][] = [];
  Object.keys(stats.users).forEach((user) => {
    sortedUsers.push([user, stats.users[user]]);
  });
  sortedUsers.sort((a, b) => {
    return b[1] - a[1];
  });

  Object.keys(stats.tags).forEach((tags) => {
    sortedTags.push([tags, stats.tags[tags]]);
  });
  sortedTags.sort((a, b) => {
    return b[1] - a[1];
  });

  return (
    <article class="stats">
      <div class="stats__heading">
        <h2>Results</h2>
        <p>
          {currentTimestamp ? (
            <small>As of {new Date(currentTimestamp).toUTCString()}</small>
          ) : (
            "-"
          )}
        </p>
      </div>
      <section>
        <h3>Feature Stats</h3>
        <ul class="bar-chart">
          <li class="bar-chart__bar">
            <span class="bar-chart__bar--label">Buildings</span>
            <div class="bar-chart__bar--value">
              <span
                class="bar-chart__bar--add"
                style={`flex-basis: ${
                  (stats.buildingsAdded / stats.buildings) * 100
                }%`}
              />
              <span
                class="bar-chart__bar--mod"
                style={`flex-basis: ${
                  (stats.buildingsModified / stats.buildings) * 100
                }%`}
              />
              <span
                class="bar-chart__bar--del"
                style={`flex-basis: ${
                  (stats.buildingsDeleted / stats.buildings) * 100
                }%`}
              />
            </div>
          </li>
          <li class="bar-chart__bar">
            <span class="bar-chart__bar--label">Highways</span>
            <div class="bar-chart__bar--value">
              <span
                class="bar-chart__bar--add"
                style={`flex-basis: ${
                  (stats.highwaysAdded / stats.highways) * 100
                }%`}
              />
              <span
                class="bar-chart__bar--mod"
                style={`flex-basis: ${
                  (stats.highwaysModified / stats.highways) * 100
                }%`}
              />
              <span
                class="bar-chart__bar--del"
                style={`flex-basis: ${
                  (stats.highwaysDeleted / stats.highways) * 100
                }%`}
              />
            </div>
          </li>
          <li class="bar-chart__bar">
            <span class="bar-chart__bar--label">Other</span>
            <div class="bar-chart__bar--value">
              <span
                class="bar-chart__bar--add"
                style={`flex-basis: ${(stats.otherAdded / stats.other) * 100}%`}
              />
              <span
                class="bar-chart__bar--mod"
                style={`flex-basis: ${
                  (stats.otherModified / stats.other) * 100
                }%`}
              />
              <span
                class="bar-chart__bar--del"
                style={`flex-basis: ${
                  (stats.otherDeleted / stats.other) * 100
                }%`}
              />
            </div>
          </li>
        </ul>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th><span class="feature--label feature--label__add">Added</span></th>
              <th><span class="feature--label feature--label__mod">Modified</span></th>
              <th><span class="feature--label feature--label__del">Deleted</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Buildings</td>
              <td>{stats.buildingsAdded}</td>
              <td>{stats.buildingsModified}</td>
              <td>{stats.buildingsDeleted} </td>
            </tr>
            <tr>
              <td>Highways</td>
              <td>{stats.highwaysAdded} </td>
              <td>{stats.highwaysModified} </td>
              <td>{stats.highwaysDeleted} </td>
            </tr>
            <tr>
              <td>Other</td>
              <td>{stats.otherAdded} </td>
              <td>{stats.otherModified} </td>
              <td>{stats.otherDeleted} </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3>User Stats</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Features</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.slice(0, 5).map((k) => (
              <tr key={k[0]}>
                <td>{k[0]}</td>
                <td>{k[1]}</td>
              </tr>
            ))}
            {expandedUsers &&
              sortedUsers.slice(5).map((k) => (
                <tr key={k[0]}>
                  <td>{k[0]}</td>
                  <td>{k[1]}</td>
                </tr>
              ))}
            {sortedUsers.length > 5 && (
              <tr onClick={() => setExpandedUsers(!expandedUsers)}>
                <td class="tr--button" colSpan={2}>
                  {!expandedUsers ? "See more +" : "See less -"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Tag Stats</h3>
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {sortedTags.slice(0, 5).map((k) => (
              <tr key={k[0]}>
                <td>{k[0]}</td>
                <td>{k[1]}</td>
              </tr>
            ))}
            {expandedTags &&
              sortedTags.slice(5).map((k) => (
                <tr key={k[0]}>
                  <td>{k[0]}</td>
                  <td>{k[1]}</td>
                </tr>
              ))}
            {sortedTags.length > 5 && (
              <tr onClick={() => setExpandedTags(!expandedTags)}>
                <td class="tr--button" colSpan={2}>
                  {!expandedTags ? "See more +" : "See less -"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </article>
  );
}
