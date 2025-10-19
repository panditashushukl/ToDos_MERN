const SocialLinksCard = ({ href, label, Icon }) => {
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="hover:text-gray-300 transition-colors duration-200"
      >
        <Icon size={22} />
      </a>
    </>
  );
};

export default SocialLinksCard;
