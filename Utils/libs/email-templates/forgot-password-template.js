exports.forgotPasswordEmailContent = async (firstName, url) => {
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
         <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Email</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
          <style>
            * {
              font-family: 'Montserrat', sans-serif;
            }
            .receipt-container {
              border-collapse: collapse;
            }
            .mail-header-container {
              width: 100%;
              height: 230px;
              max-height: 230px;
            }
            img.header {
              width: inherit;
              height: inherit;
            }
            td a {
              text-decoration: none;
            }
            .mail-body {
              padding: 5px 0px 87px;
              width: 90%;
              margin: auto;
            }
            .mail-body h1 {
              font-size: 24px;
              color: #050404;
            }
            .mail-body .content {
              color: #050404;
              font-weight: 600;
              opacity: 0.8;
              padding: 10px 0;
              font-size:18px;
            }
            
            .mail-body a {
              display: inline-block;
              background-color: #4D49FF;
              color: #FFFFFF;
              padding: 13px 35px;
              border-radius: 3px;
              margin-top: 1rem;
            }
  
            
            .signature {
              text-align: center;
              padding: 15px 0;
            }
            .signature img {
              text-align: center;
              display: inline-block;
            }
            .mail-btm {
              padding: 16px 0;
              background: #252F3F;
              color: white;
            }
            .mail-btm .inner {
              width: 90%;
              margin: auto;
            }
            .mail-btm .inner hr {
              border: 1px solid #858A97;
            }
            .mail-btm .inner .unsubscribe {
              padding: 20px 0;
              color: #858A97;
              font-size: 14px;
            }
            .mail-btm .inner .unsubscribe .left {
              float: left;
              display: block;
            }
            .mail-btm .inner .unsubscribe .right {
              float: right;
              display: block;
            }
            .mail-btm .company-name {
              font-weight: 600;
              font-size: 21px;
              color: #FFFFFF;
              padding: 15px 0;
            }
            td {
              font-weight: 400;
              color: #505050;
            }
          </style>
        </head>
        
        <body style="margin: 0; padding: 0;">
            <table cellpadding="0" cellspacing="0" width="100%">
             <tr>
              <td>
                <table class="receipt-container" align="center" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                    <td>
                      <div class="mail-header-container" style="text-align: center">
                        <img class="header" src="https://res.cloudinary.com/theonlybakare/image/upload/v1596837576/Password_reset_v5jwbq.png" alt="Header" border="0">
                      </div>
                      <br>
                    </td>
                  </tr>
        
                  <tr>
                    <td>
        
                      <div class="mail-body">
                        <h1>Dear ${firstName},</h1>
        
                        <div class="content">
                          <p>You are receiving this email because you (or someone else) has initiated a request to change your password. Please proceed to reset your password, or ignore this. This link expires in 30 minutes.</p>
  
                          <a href ='${url}'>Proceed</a>
                        </div>
  
                      </div>
        
                    </td>
                  </tr>
        
                  <tr>
                    <td>
                      <div class="mail-btm">
                        <div class="inner">
                            <div class="company-name">Zuri Talents</div>
                            <hr>
                            <div class="unsubscribe">
                              <span class="left">
                                No 5 Herbert Albert Drive, <br/>
                                Victoria Island Lagos. <br/>
                                <br/>
                                <span>Phone: </span><span style="color:white">+1 01234 56789</span>
                              </span>
        
                              <div style="clear: both"></div>
                            </div>
                        </div>
                      </div>
                    </td>
                  </tr>
        
                </table>
              </td>
             </tr>
            </table>
           </body>
        
        </html>`;
    return html;
  };
  