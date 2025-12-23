const ReusableCard = ({
  img,
  text,
  title,
  onClick,
}: {
  img: any;
  text: string;
  title: string;
  onClick: (title: string) => void;
}) => {
  const clickedHandler = () => {
    onClick(title);
  };

  return (
    <div className="relative">
      {/* Shake efekat na hover*/}
      <style>{`
          @keyframes subtleShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-1px); }
          }
  
          .subtle-shake:hover {
            animation: subtleShake 0.4s ease-in-out;
          }
        `}</style>

      <div
        className="bg-white rounded-2xl shadow-lg p-8 
                     hover:shadow-2xl 
                     transition-shadow 
                     cursor-pointer 
                     border-2 border-purple-300 
                     subtle-shake"
        onClick={clickedHandler}
      >
        <div className="text-5xl mb-4 text-center">{img}</div>
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-center text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default ReusableCard;
