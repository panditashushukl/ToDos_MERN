import { SocialLinksCard } from "./../index";

import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaFirefoxBrowser,
  FaInstagram,
} from "react-icons/fa";

const SocialCard = () => {
  return (
    <div className="mt-6 border-t border-gray-700 pt-4 text-center flex-shrink-0">
      <p className="text-sm text-gray-400 mb-4 font-light">
        Developed by Ashutosh Shukla
      </p>
      <div className="flex justify-center space-x-6 text-white">
        <SocialLinksCard
          href={"https://github.com/panditashushukl"}
          label={"Github"}
          Icon={FaGithub}
        />

        <SocialLinksCard
          href={"https://twitter.com/panditashushukl"}
          label={"Twitter"}
          Icon={FaTwitter}
        />

        <SocialLinksCard
          href={"https://linkedin.com/in/panditashushukl"}
          label={"LinkedIn"}
          Icon={FaLinkedin}
        />

        <SocialLinksCard
          href={"https://www.instagram.com/panditashushukl/"}
          label={"Instagram"}
          Icon={FaInstagram}
        />

        <SocialLinksCard
          href={"https://panditashushukl.github.io/portfolio/"}
          label={"Portfolio"}
          Icon={FaFirefoxBrowser}
        />
      </div>
    </div>
  );
};

export default SocialCard;
