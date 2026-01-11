import { Placeholder, Rows } from "@canva/app-ui-kit";

const PlaceholderView = () => {
  return (
    <Rows spacing="2u">
      <div
        style={{
          height: "200px",
        }}
      >
        <Placeholder shape="rectangle" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Rows key={index} spacing="1u">
          <div
            style={{
              height: "22px",
            }}
          >
            <Placeholder shape="rectangle" />
          </div>
          <div
            style={{
              height: "40px",
            }}
          >
            <Placeholder shape="rectangle" />
          </div>
        </Rows>
      ))}
      <div
        style={{
          height: "40px",
        }}
      >
        <Placeholder shape="rectangle" />
      </div>
    </Rows>
  );
};

export default PlaceholderView;
