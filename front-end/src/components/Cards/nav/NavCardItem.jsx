import { useTodo } from "./../../../contexts/TodoContext";

const NavCardItem = ({Icon,state,stateLabel}) => {
  const { stats,handleStatusFilterChange,statusFilter } = useTodo();
  const navContentStyle =
    "hover:bg-gray-700 p-3 rounded-lg cursor-pointer flex items-center transition-colors duration-200";
  const all = stats ? stats.pending + stats.completed + stats.archived : 0;
  const count = state === "all" ? all : stats?.[state] || 0;
  
  return (
    <>
      <li
        className={`${navContentStyle} ${
          statusFilter === `${state}` ? "bg-gray-700" : ""
        }`}
        onClick={() => handleStatusFilterChange(state)}
      >
        <Icon className="mr-3 text-indigo-400" />
        {stateLabel} ({`${state == "all" ? all : count}`})
      </li>
    </>
  );
};

export default NavCardItem;
