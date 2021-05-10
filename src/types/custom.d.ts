import { ReactComponentElement } from "react";

declare module "*.svg" {
  const content: any;
  export default content;
}