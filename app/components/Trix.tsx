import React from "react";
import dynamic from "next/dynamic";

const loadingComponent = () => <div>Loading ...</div>;
const WysiwygComponent = dynamic(
  () => {
    import("trix");
    return import("react-trix-rte").then((m) => m.ReactTrixRTEInput);
  },
  {
    ssr: false,
    loading: loadingComponent,
  },
);

export default function Trix(props) {
  if (props.loading) return loadingComponent();

  return <WysiwygComponent {...props} />;
}
