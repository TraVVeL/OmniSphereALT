import * as React from "react";
const DefaultUserIcon = (props) => (
  <svg
    width={64}
    height={64}
    viewBox="0 0 1.92 1.92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g strokeWidth={0} />
    <g strokeLinecap="round" strokeLinejoin="round" />
    <g strokeLinecap="round" strokeWidth={0.08}>
      <path
        d="M1.4.28h.016c.143 0 .215 0 .26.044.044.045.044.116.044.26V.6M1.4 1.64h.016c.143 0 .215 0 .26-.044.044-.045.044-.116.044-.26V1.32M.52.28H.504C.361.28.289.28.245.324.2.369.2.441.2.584V.6m.32 1.04H.504c-.143 0-.215 0-.259-.044C.2 1.551.2 1.479.2 1.336V1.32"
        stroke="var(--bs-body-color)"
        strokeOpacity={0.24}
      />
      <path
        d="M.577 1.263a.4.4 0 0 1 .16-.133.5.5 0 0 1 .223-.05c.078 0 .155.017.223.05a.4.4 0 0 1 .16.133M1.16.72a.2.2 0 0 1-.2.2.2.2 0 0 1-.2-.2.2.2 0 0 1 .4 0z"
        stroke="var(--bs-body-color)"
      />
    </g>
  </svg>
);
export default DefaultUserIcon;
