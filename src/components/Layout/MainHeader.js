import logo  from "../../assets/idmb.png";

const MainHeader = () => {
  return (
    <header className="p-3 w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        {/* <img src={logo} alt="idmb_logo" className="w-28 object-contain" /> */}

        <button
          type="button"
          onClick={() =>
            window.open(
              "https://github.com/Emmyn5600/TV-Script-Summarizer",
              "_blank"
            )
          }
          className="black_btn"
        >
          GitHub
        </button>
      </nav>

      <h1 className="head_text">
        Summarize Movie script with <br className="max-md:hidden" />
        <span className="orange_gradient">OpenAI GPT-4</span>
      </h1>
      <h2 className="desc">
        Simplify your reading with Summize, an open-source movie script
        summarizer that transforms length movie script into clear and concise
        summaries
      </h2>
    </header>
  );
};

export default MainHeader;
