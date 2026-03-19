import type { LinkProps } from "./types";
import "./styles.css";

const Link: React.FC<LinkProps> = ({ href, name, className }) => {
  return (
    <a href={href} className={className}>
      {name}
    </a>
  );
};

export default Link;
