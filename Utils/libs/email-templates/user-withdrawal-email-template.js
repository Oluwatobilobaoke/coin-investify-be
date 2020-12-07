exports.registerEmailContent = async (firstName, amount, WalletAddress) => {
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
            padding: 5px 0px;
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
                      <img class="header" src="${process.env.COIN_INVESTIFY_WELCOME_EMAIL_HEADER}" alt="Header" border="0">
                    </div>
                    <br>
                  </td>
                </tr>
      
                <tr>
                  <td>
      
                    <div class="mail-body">
                      <h1>Dear ${firstName},</h1>
      
                      <div class="content">
                        You Just initiated a withdrawal!
                        <p>Amount: ${amount}</p> to address ${WalletAddress}
                        If it was not you, kinldy contact support now!
                      </div>
                  </td>
                </tr>
      
                <tr>
                  <td>
                    <div class="mail-btm">
                      <div class="inner">
                          <div class="company-name">COIN INVESTIFY</div>
                          <hr>
                          <div class="unsubscribe">
                              <span>email: </span>
                              <span>
                                <a href="mailto:info@coininvestify.com" style="color:white">info@coininvestify.com</a>
                              </span>
                            <p style="color: white">This email is an important notice of a status change that may affect your account. Please read the information carefully as actions, once taken, may be permanent</p>
                            
                            <a style="color:white" href="#" class="right">Unsubscribe</a>
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
      
      </html>
      `;
    return html;
  };
  