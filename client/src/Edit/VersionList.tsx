import * as Cotype from "../../../typings";
import React from "react";
import TimeAgo from "react-time-ago";
import styled, { css, CSSProp } from "styled-components/macro";
import StatusLight from "../common/StatusLight";
import MoreButton from "../common/MoreButton";
import { withUser } from "../auth/UserContext";
import { isAllowed, Permission } from "../auth/acl";
const { publish } = Permission;

const Root = styled("div")`
  background: var(--dark-grey);
  height: 100%;
  border-left: 1px solid #f5f5f5;
`;
const Author = styled("div")`
  color: #848484;
  font-size: 0.75em;
`;

const Status = styled("div")`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 0.75em;
  color: #848484;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`;

const Version = styled.div<{ css: CSSProp }>`
  display: flex;
  width: 100%;
  position: relative;
  color: #fff;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #f5f5f5;
  padding: 10px 15px;
  box-sizing: border-box;
  align-items: center;
  background: #fff;
  cursor: pointer;
  display: block;
  position: relative;
  text-decoration: none;
  color: inherit;
`;

const activeClass = css`
  background: var(--accent-color);
  color: #fff;
  & > div {
    color: #fff;
  }
`;

const dateClass = css`
  a > &:hover {
    text-decoration: underline;
  }
`;

type VersionList = {
  model: Cotype.Model;
  versions: (Cotype.VersionItem & { published: boolean })[];
  activeVersion?: number | string;
  onSelectVersion: (v: Cotype.VersionItem) => void;
  onUnpublish: () => void;
  user: Cotype.Principal & Cotype.User;
};
function VersionList({
  model,
  versions,
  activeVersion,
  onSelectVersion,
  onUnpublish,
  user
}: VersionList) {
  if (!versions) return null;
  const canPublish = isAllowed(user, model, publish);

  const isSingleton = model.collection === "singleton";
  return (
    <Root>
      {versions.map(v => (
        <Version
          key={v.rev}
          css={activeVersion === v.rev ? activeClass : ""}
          onClick={() => onSelectVersion(v)}
        >
          <TimeAgo className={dateClass} date={new Date(new Date(v.date))} />
          {v.published && (
            <Status>
              <StatusLight color="green" /> Published
              {canPublish && !isSingleton && (
                <MoreButton
                  buttonStyle={{ paddingTop: 0, marginLeft: 6 }}
                  actions={[
                    {
                      label: "Unpublish",
                      onClick: () => onUnpublish()
                    }
                  ]}
                />
              )}
            </Status>
          )}
          <Author>{v.author_name}</Author>
        </Version>
      ))}
    </Root>
  );
}

export default withUser(VersionList);
