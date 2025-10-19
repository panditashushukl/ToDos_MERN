import { FaHome, FaCheckCircle, FaArchive, FaClock } from "react-icons/fa";
import { NavCardItem } from "./../../index";

const NavCard = () => {

  return (
    <nav>
      <ul className="space-y-1 text-gray-300 text-lg">
        <NavCardItem
          Icon={FaHome}
          stateLabel={"All Todo"}
          state={"all"}
        />
        <NavCardItem
          Icon={FaClock}
          stateLabel={"Pending"}
          state={"pending"}
        />
        <NavCardItem
          Icon={FaCheckCircle}
          stateLabel={"Completed"}
          state={"completed"}
        />
        <NavCardItem
          Icon={FaArchive}
          stateLabel={"Archieved"}
          state={"archived"}
        />
      </ul>
    </nav>
  );
};

export default NavCard;
