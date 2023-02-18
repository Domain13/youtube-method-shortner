import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { isURL } from "validator";
import { IsLoadingContext } from "../contexts/isLoading";
// import Branch from 'branch-sdk';

// define(['branch'], function(branch) { 
//   branch.init('key_live_fc4ZZr6217Ls2oD732UpGnjiytcWqQRI', function(err, data) {
//   console.log(err, data);
//   });
//  });

const options = {
  method: 'POST',
  headers: {accept: 'application/json', 'content-type': 'application/json'},
  body: JSON.stringify({
    data: {
      $desktop_url: 'https://github.com/KRShanto',
      $android_url: 'https://github.com/KRShanto',
      $web_only: true,
      $blackberry_url: 'https://github.com/KRShanto',
      $windows_phone_url: 'https://github.com/KRShanto',
      $fire_url: 'https://github.com/KRShanto',
      $ios_wechat_url: 'https://github.com/KRShanto',
      $android_wechat_url: 'https://github.com/KRShanto',
      $huawei_url: 'https://github.com/KRShanto',
      $samsung_url: 'https://github.com/KRShanto',
      $android_url_xx: 'https://github.com/KRShanto',
      $ipad_url: 'https://github.com/KRShanto',
      $ios_url_xx: 'https://github.com/KRShanto',
      $ios_url: 'https://github.com/KRShanto'
    },
    branch_key: 'key_live_fc4ZZr6217Ls2oD732UpGnjiytcWqQRI'
  })
};

fetch('https://api2.branch.io/v1/url', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [outputLink, setOutputLink] = useState("");
  const [copyMsg, setCopyMsg] = useState(
    <>
      <i className="fa-solid fa-copy"></i> copy
    </>
  );
  const [output, setOutput] = useState("d-none");
  const [domains, setDomains] = useState([]);

  const isLoadingContext = useContext(IsLoadingContext);

  useEffect(() => {
    const fetchDomains = async () => {
      const response = await fetch("/api/get_domains");
      const datas = await response.json();

      if (datas.type === "SUCCESS") {
        setDomains(datas.data);
      }
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    if (domains.length > 0) {
      setDomainInput(domains[0].domain);
    }
  }, [domains]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isURL(urlInput, { require_protocol: true }) || domainInput === "") {
      alert("You need to provide valid url and domain");
      return;
    }

    isLoadingContext.setIsLoading(true);
    const response = await fetch(`/api/create_url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: urlInput,
        domain: domainInput,
      }),
    });

    const datas = await response.json();




    
    if (datas.type === "SUCCESS") {

      // let firstShortLInk = `${datas.data.firstToken}=https://www.yo%75%74%75be.com/redirect?q=${datas.data.encoded}/${datas.data.shortCode}%26redir_token=${datas.data.youtubeToken}`;


      // const response2 = await fetch(`/api/create_url`,{
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     url: firstShortLInk,
      //     domain: domainInput,
      //   }),
      // });
  
      // const datas2 = await response2.json();

      // const encodLink = encodeURIComponent(domainInput);

      setOutputLink(
        // `${domainInput}/${datas.data.shortCode}`
        `https://www.youtube.com/redirect?event=comments&redir_token=${datas.data.youtubeToken}&q=${urlInput}&html_redirect=1`
        
      );

      setCopyMsg(
        <>
          <i className="fa-solid fa-copy"></i> Copy
        </>
      );
    } else if (datas.type === "ALREADY") {
      // the alias and domain already exist
      alert("The domain already exist");
    } else if (datas.type === "NOTFOUND") {
      alert("The code doesn't match");
    } else {
      setOutputLink("Something went wrong");
    }

    setOutput("output-link");
    isLoadingContext.setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputLink);

    setCopyMsg(
      <>
        <i className="fa-solid fa-check"></i> Copied Success
      </>
    );
  };



  return (
    <>
      <Head>
        <title>Hello</title>
      </Head>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <marquee className="notice" behavior="scroll" direction="left">শর্টনার এবং যে কোনো আপডেট এর জন্য নিচের Whatsapp নাম্বারে যোগাযোগ করুন...</marquee>
      <a href="tel:+8801660037359" style={{display: 'flex'}} className="notice"><img style={{filter: 'drop-shadow(0 3px 3px #000)', height: '25px'}} src="./whatsapp.png" alt="Whatsapp icon" /> ০১৬৬০০৩৭৩৫৯ </a>
        <hr />
        <label htmlFor="domain">Select your domain</label>
        <select
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
        >
          {domains.map((domain, index) => (
            <option key={index} value={domain.domain}>
              {domain.domain}
            </option>
          ))}
        </select>
        <label htmlFor="url">Enter your link</label>
        <textarea
          id="url"
          name="url"
          placeholder="https://example.com"
          onBlur={(e) => setUrlInput(e.target.value)}
        />
        <input className="btn" type="submit" value="Shorten" />
      </form>

      {urlInput && (
        <div className={output}>
          <button onClick={handleCopy} className="btn">
            {copyMsg}
          </button>
          <p>{outputLink}</p>
        </div>
      )}
    </>
  );
}
