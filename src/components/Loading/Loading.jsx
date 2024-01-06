import "./Loading.css";

const Loading = () => {
  return (
    <div className="loadder">
      <div>
        Loading ...
        <svg>
          <rect x="1" y="1" />
        </svg>
      </div>
    </div>
  );
};

export default Loading;
