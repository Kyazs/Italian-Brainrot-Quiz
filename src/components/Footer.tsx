import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import KyazsLogo from "../assets/images/kyazs-logo.png";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "../assets/styles/Footer.scss";

function Footer() {
  return (
    <footer>
      <a href="https://kyazs.github.io/Kyazs-Portfolio/" target="_blank" rel="noreferrer">
        <img src={KyazsLogo} alt="Kyazs Dev" width={100} />
      </a>
      <div>
        <a href="https://github.com/kyazs" target="_blank" rel="noreferrer">
          <GitHubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/jcasper-santos/"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInIcon />
        </a>
      </div>
      <p>
        A website designed & built by{" "}
        <a href="https://github.com/Kyazs" target="_blank" rel="noreferrer">
          John Casper Santos
        </a>
      </p>
    </footer>
  );
}

export default Footer;
