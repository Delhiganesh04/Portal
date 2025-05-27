const express = require('express');
const axios = require('axios');
const convert = require('xml-js');
const nodemailer = require('nodemailer');
const cors = require('cors');
//  const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();
const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const SAP_CLIENT = '100';
// const passKey = process.env.SAP_AUTH_KEY; 

const passKey = process.env.PASS_KEY;
const ID = process.env.ID
const PASSWORD = process.env.PASSWORD



 
//login

app.post('/login', async (req, res) => {

    const {id , password} = req.body
 
    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
  <soapenv:Header/>
   <soapenv:Body>
      <urn:ZfmCustporAuthDg>
         <Id>${id}</Id>
         <Password>${password}</Password>
      </urn:ZfmCustporAuthDg>
   </soapenv:Body>
</soapenv:Envelope>`;
 
    try {
        const response = await axios.post(
            'http://azktlds5cp.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_auth_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                },
               
            }
        );
 
        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });
        const responseBody = result['soap-env:Envelope']['soap-env:Body']['n0:ZfmCustporAuthDgResponse'];
 
        res.json({
        message: responseBody?.Message?._text || 'Unknown',
        status: responseBody?.Validation?._text || 'Failed'
        });
    } catch (error) {
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});


//Profile

app.post('/profile', async (req, res) => {
    const { id } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporProfileDg>
                <Id>${id}</Id>
            </urn:ZfmCustporProfileDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://azktlds5cp.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_profile_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });
        const responseBody = result['soap-env:Envelope']['soap-env:Body']['n0:ZfmCustporProfileDgResponse']['EsKna1'];

        res.json({
            Kunnr: responseBody?.Kunnr?._text || '',
            Land1: responseBody?.Land1?._text || '',
            Name1: responseBody?.Name1?._text || '',
            Ort01: responseBody?.Ort01?._text || '',
            Pstlz: responseBody?.Pstlz?._text || '',
            Regio: responseBody?.Regio?._text || '',
            Sortl: responseBody?.Sortl?._text || '',
            Stras: responseBody?.Stras?._text || '',
            Telf1: responseBody?.Telf1?._text || '',
            Telex: responseBody?.Telex?._text || '',
            Xcpdk: responseBody?.Xcpdk?._text || '',
            Adrnr: responseBody?.Adrnr?._text || ''
        });

    } catch (error) {
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});


//inquiries

app.post('/inquiries', async (req, res) => {
    const { customerId } = req.body;
    // let customerId = '0000000001'; 

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporInquiriesDg>
                <Customerid>${customerId}</Customerid>
            </urn:ZfmCustporInquiriesDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_inquiries_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustporInquiriesDgResponse']
            ?.EtInquiryData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No inquiries found.' });
        }

        // Ensure it's always an array
        const inquiries = Array.isArray(items) ? items : [items];

        const formatted = inquiries.map(item => ({
            Kunnr: item.Kunnr?._text || '',
            Erdat: item.Erdat?._text || '',
            Auart: item.Auart?._text || '',
            Angdt: item.Angdt?._text || '',
            Bnddt: item.Bnddt?._text || '',
            Vbeln: item.Vbeln?._text || '',
            Posnr: item.Posnr?._text || '',
            Posar: item.Posar?._text || '',
            Arktx: item.Arktx?._text || '',
            Netwr: item.Netwr?._text || '',
            Waerk: item.Waerk?._text || '',
            Vrkme: item.Vrkme?._text || '',
            Kwmeng: item.Kwmeng?._text || ''
        }));

        res.json(formatted);

    } catch (error) {
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});


//salesorder

app.post('/sales-orders', async (req, res) => {
    const { customerId } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                         xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporSalesordDg>
                <Kunnr>${customerId}</Kunnr>
            </urn:ZfmCustporSalesordDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_salesord_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustporSalesordDgResponse']
            ?.EsSalesordData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No sales orders found.' });
        }

        const orders = Array.isArray(items) ? items : [items];

        const formatted = orders.map(item => ({
            Vbeln: item.Vbeln?._text || '',
            Posnr: item.Posnr?._text || '',
            Matnr: item.Matnr?._text || '',
            Arktx: item.Arktx?._text || '',
            Auart: item.Auart?._text || '',
            Erdat: item.Erdat?._text || '',
            Kwmeng: item.Kwmeng?._text || '',
            VdatuAna: item.VdatuAna?._text || '',
            Bstnk: item.Bstnk?._text || '',
            Kunnr: item.Kunnr?._text || '',
            Vrkme: item.Vrkme?._text || '',
            Netwr: item.Netwr?._text || '',
            Waerk: item.Waerk?._text || '',
            Spart: item.Spart?._text || '',
            Lfgsk: item.Lfgsk?._text || '',
            Lgort: item.Lgort?._text || '',
            Gbstk: item.Gbstk?._text || ''
        }));

        res.json(formatted);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});


// LIST OF DELIVERY

app.post('/deliveries', async (req, res) => {
    const { customerId } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                         xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustportLstofdelDg>
                <Kunnr>${customerId}</Kunnr>
            </urn:ZfmCustportLstofdelDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_listofdelivery_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustportLstofdelDgResponse']
            ?.EsLstofdelData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No deliveries found.' });
        }

        const deliveries = Array.isArray(items) ? items : [items];

        const formatted = deliveries.map(item => ({
            Vbeln: item.Vbeln?._text || '',
            Posnr: item.Posnr?._text || '',
            Matnr: item.Matnr?._text || '',
            Arktx: item.Arktx?._text || '',
            Lfart: item.Lfart?._text || '',
            Lfdat: item.Lfdat?._text || '',
            Kunnr: item.Kunnr?._text || '',
            Vrkme: item.Vrkme?._text || '',
            Lfimg: item.Lfimg?._text || '',
            Netwr: item.Netwr?._text || '',
            Waerk: item.Waerk?._text || '',
            Lgort: item.Lgort?._text || '',
            Bestk: item.Bestk?._text || '',
            Gbstk: item.Gbstk?._text || '',
            Vstel: item.Vstel?._text || '',
            Werks: item.Werks?._text || ''
        }));

        res.json(formatted);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});
 
//credit-debit

app.post('/creddebs', async (req, res) => {
    const { customerId } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                         xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporCreddebDg>
                <Kunag>${customerId}</Kunag>
            </urn:ZfmCustporCreddebDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            // 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_custpor_creddeb_dg?sap-client=100',
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_creddeb_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustporCreddebDgResponse']
            ?.EsCreddebData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No credit/debit data found.' });
        }

        const records = Array.isArray(items) ? items : [items];

        const formatted = records.map(item => ({
            Kunag: item.Kunag?._text || '',
            Vbeln: item.Vbeln?._text || '',
            Fkart: item.Fkart?._text || '',
            Vbtyp: item.Vbtyp?._text || '',
            Waerk: item.Waerk?._text || '',
            Vkorg: item.Vkorg?._text || '',
            Kalsm: item.Kalsm?._text || '',
            Knumv: item.Knumv?._text || '',
            Vsbed: item.Vsbed?._text || '',
            Fkdat: item.Fkdat?._text || '',
            Kurrf: item.Kurrf?._text || '',
            Netwr: item.Netwr?._text || '',
            Erzet: item.Erzet?._text || '',
            Erdat: item.Erdat?._text || '',
            Stwae: item.Stwae?._text || '',
            BstnkVf: item.BstnkVf?._text || '',
            Arktx: item.Arktx?._text || '',
            Martnr: item.Martnr?._text || '',
            Posnr: item.Posnr?._text || '',
            Vrkme: item.Vrkme?._text || '',
            Fktyp: item.Fktyp?._text || ''
        }));

        res.json(formatted);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

//overall sales data
app.post('/overallsales', async (req, res) => {
    const { customerId } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                         xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporOverallsalesdataD>
                <Kunnr>${customerId}</Kunnr>
            </urn:ZfmCustporOverallsalesdataD>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_overallsalesdata_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustporOverallsalesdataDResponse']
            ?.EsOverallallsalesdataData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No sales data found.' });
        }

        const records = Array.isArray(items) ? items : [items];

        const formatted = records.map(item => ({
            Vbeln: item.Vbeln?._text || '',
            Audat: item.Audat?._text || '',
            Kunnr: item.Kunnr?._text || '',
            Vkorg: item.Vkorg?._text || '',
            Vtweg: item.Vtweg?._text || '',
            Spart: item.Spart?._text || '',
            Netwr: item.Netwr?._text || '',
            Waerk: item.Waerk?._text || '',
            Vkbur: item.Vkbur?._text || '',
            Vkgrp: item.Vkgrp?._text || '',
            Bstnk: item.Bstnk?._text || '',
            Matnr: item.Matnr?._text || '',
            Arktx: item.Arktx?._text || '',
            Kwmeng: item.Kwmeng?._text || '',
            Vrkme: item.Vrkme?._text || '',
            Pstyv: item.Pstyv?._text || '',
            Posex: item.Posex?._text || ''
        }));

        res.json(formatted);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

//invoice fields

app.post('/invoicedata', async (req, res) => {
    const { customerId } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                         xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporInvoiceDataDg>
                <Customerid>${customerId}</Customerid>
            </urn:ZfmCustporInvoiceDataDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_invoice_data_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                   'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustporInvoiceDataDgResponse']
            ?.EttInvoiceData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No invoice data found.' });
        }

        const records = Array.isArray(items) ? items : [items];

        const formatted = records.map(item => ({
            Vbeln: item.Vbeln?._text || '',
            Fkdat: item.Fkdat?._text || '',
            Erdat: item.Erdat?._text || '',
            Kunrg: item.Kunrg?._text || '',
            Fkart: item.Fkart?._text || '',
            Vkorg: item.Vkorg?._text || '',
            Vtweg: item.Vtweg?._text || '',
            Spart: item.Spart?._text || '',
            Netwr: item.Netwr?._text || '',
            Waerk: item.Waerk?._text || '',
            Xblnr: item.Xblnr?._text || '',
            Posnr: item.Posnr?._text || '',
            Matnr: item.Matnr?._text || '',
            Arktx: item.Arktx?._text || '',
            Fkimg: item.Fkimg?._text || '',
            Vrkme: item.Vrkme?._text || ''
        }));

        res.json({ data: formatted });
    } catch (error) {
        console.error('SOAP Request Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch invoice data' });
    }
});

//invoice pdf
app.post('/invoicepdf', async (req, res) => {
    const { Docno, Itemno } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                         xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmTestForms>
                <Docno>${Docno}</Docno>
                <Itemno>${Itemno}</Itemno>
            </urn:ZfmTestForms>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_invoice_pdf_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}` 
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const base64Data = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmTestFormsResponse']
            ?.EvBase64?._text;

        if (!base64Data) {
            return res.status(404).json({ message: 'No PDF data found.' });
        }

        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${Docno}_${Itemno}.pdf`);
        
        // Send the PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "SAP error", 
            detail: error.message,
            ...(error.response && { responseData: error.response.data })
        });
    }
});


//payage
app.post('/payage', async (req, res) => {
    const { customerId } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmCustporPayageDg>
                <Kunnr>${customerId}</Kunnr>
            </urn:ZfmCustporPayageDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_cp_payage_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmCustporPayageDgResponse']
            ?.EsPayageData
            ?.item;

        if (!items) {
            return res.status(404).json({ message: 'No payment data found.' });
        }

        const payageData = Array.isArray(items) ? items : [items];

        const formatted = payageData.map(item => ({
            Kunnr: item.Kunnr?._text || '',
            Bukrs: item.Bukrs?._text || '',
            Belnr: item.Belnr?._text || '',
            Gjahr: item.Gjahr?._text || '',
            Buzei: item.Buzei?._text || '',
            Augbl: item.Augbl?._text || '',
            Wrbtr: item.Wrbtr?._text || '',
            Mwskz: item.Mwskz?._text || '',
            Zfbdt: item.Zfbdt?._text || '',
            Vbeln: item.Vbeln?._text || '',
            Budat: item.Budat?._text || '',
            Bldat: item.Bldat?._text || '',
            Cpudt: item.Cpudt?._text || '',
            Waers: item.Waers?._text || '',
            Blart: item.Blart?._text || '',
            Monat: item.Monat?._text || ''
        }));

        res.json(formatted);

    } catch (error) {
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

// -----------------------------------------VENDOR PORTAL----------------------------------------------------

// Profile and Login

app.get('/getVendorDetails', async (req, res) => {
    const accountNumber = req.query.accountNo; //sample accountNo = 0000100000

    if (!accountNumber) {
        return res.status(400).json({ error: 'Missing account number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_PROFILE_LOGIN_DG_SRV/ZVP_PROFILE_LOGIN_DGSet('${accountNumber}')?$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: `${ID}`,
                password: `${PASSWORD}`
            }
        });

        const vendorData = response.data.d;
        res.json(vendorData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch vendor data' });
    }
});

//Request for Quotation
app.get('/reqforqot', async (req, res) => {
    const vendorNumber = req.query.vendorNo; //sample vendorNo=0000100000

    if (!vendorNumber) {
        return res.status(400).json({ error: 'Missing vendor number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_REQFORQOT_DG_SRV/ZVP_REQFORQOT_DGSet?$filter=Lifnr eq '${vendorNumber}'&$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: `${ID}`,
                password: `${PASSWORD}`
            }
        });

        const rfqList = response.data.d.results;
        res.json(rfqList);
    } catch (error) {
        console.error('Error fetching RFQ data:', error.message);
        res.status(500).json({ error: 'Failed to fetch RFQ data' });
    }
});
  //Purchase Order

  app.get('/purchaseorder', async (req, res) => {
    const accountNumber = req.query.accountNo; // sample accountNo: 0000100000

    if (!accountNumber) {
        return res.status(400).json({ error: 'Missing account number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_PO_DG_SRV/ZVP_PO_DGSet?$filter=Lifnr eq ('${accountNumber}') and Bstyp eq ('F')&$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: `${ID}`,
                password: `${PASSWORD}`
            }
        });

        const poData = response.data.d.results;
        res.json(poData);
    } catch (error) {
        console.error('Error fetching purchase order data:', error.message);
        res.status(500).json({ error: 'Failed to fetch purchase order data' });
    }
});

//Goods Receipt
app.get('/goodsreceipt', async (req, res) => {
    const accountNumber = req.query.accountNo; // example: 0000100000

    if (!accountNumber) {
        return res.status(400).json({ error: 'Missing account number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_GOODSRECEIPT_DG_SRV/ZVP_GOODSRECEIPT_DGSet?$filter=Lifnr eq ('${accountNumber}')&$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: ID,
                password: PASSWORD
            }
        });

        const goodsReceiptData = response.data.d.results;
        res.json(goodsReceiptData);
    } catch (error) {
        console.error('Error fetching goods receipt data:', error.message);
        res.status(500).json({ error: 'Failed to fetch goods receipt data' });
    }
});


//credit-debit
app.get('/creditdebit', async (req, res) => {
    const accountNumber = req.query.accountNo; // example: 0000100000

    if (!accountNumber) {
        return res.status(400).json({ error: 'Missing account number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_CREDDEB_DG_SRV/ZVP_CREDDEB_DGSet?$filter=Lifnr eq ('${accountNumber}')&$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: ID,
                password: PASSWORD
            }
        });

        const creditDebitData = response.data.d.results;
        res.json(creditDebitData);
    } catch (error) {
        console.error('Error fetching credit/debit data:', error.message);
        res.status(500).json({ error: 'Failed to fetch credit/debit data' });
    }
});

//payage
app.get('/payage', async (req, res) => {
    const accountNumber = req.query.accountNo; // example: 0000100000

    if (!accountNumber) {
        return res.status(400).json({ error: 'Missing account number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_PAYAGE_DG_SRV/ZVP_PAYAGE_DGSet?$filter=Lifnr eq ('${accountNumber}')&$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: ID,
                password: PASSWORD
            }
        });

        const payageData = response.data.d.results;
        res.json(payageData);
    } catch (error) {
        console.error('Error fetching payage data:', error.message);
        res.status(500).json({ error: 'Failed to fetch payage data' });
    }
});

//invoice 
app.get('/invoice', async (req, res) => {
    const accountNumber = req.query.accountNo; // example: 0000100000

    if (!accountNumber) {
        return res.status(400).json({ error: 'Missing account number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZV_INVOICE_DG_SRV/ZVP_INVOICE_DGSet?$filter=Lifnr eq ('${accountNumber}')&$format=json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: ID,
                password: PASSWORD
            }
        });

        const invoiceData = response.data.d.results;
        res.json(invoiceData);
    } catch (error) {
        console.error('Error fetching invoice data:', error.message);
        res.status(500).json({ error: 'Failed to fetch invoice data' });
    }
});

//invoice pdf

app.get('/downloadInvoice', async (req, res) => {
    const { belnr } = req.query;

    if (!belnr) {
        return res.status(400).json({ error: 'Missing document number' });
    }

    const url = `http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/sap/ZVP_INVOICEPDF_DG_SRV/ZVP_INVOICEPDF_DGSet(Belnr='${belnr}')/$value`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: process.env.SAP_USERNAME || ID,
                password: process.env.SAP_PASSWORD || PASSWORD
            },
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${belnr}.pdf`);
        res.send(response.data);
    } catch (error) {
        console.error('Error downloading invoice PDF:', error.message);
        res.status(500).json({ error: 'Failed to download invoice PDF' });
    }
});



// -------------------------------------------------EMPLOYEE PORTAL------------------------------------------------------------------

app.post('/login3', async (req, res) => {
    const { id, password } = req.body;

    const SOAPbody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZfmEmpporAuth>
         <IvId>${id}</IvId>
         <IvPassword>${password}</IvPassword>
      </urn:ZfmEmpporAuth>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_ep_auth_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });
        const responseBody = result['soap-env:Envelope']['soap-env:Body']['n0:ZfmEmpporAuthResponse'];

        res.json({
            message: responseBody?.EvMessage?._text || 'Unknown',
            status: responseBody?.EvValidation?._text || 'Failed'
        });
    } catch (error) {
        console.error('SAP Error:', error.message);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

app.post('/emp_profile', async (req, res) => {
    const { id } = req.body;

    const SOAPbody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZfmEmporProfile>
         <IvId>${id}</IvId>
      </urn:ZfmEmporProfile>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_ep_profile_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const profile = result['soap-env:Envelope']['soap-env:Body']['n0:ZfmEmporProfileResponse']['EsProfile'];

        res.json({
            Pernr: profile.Pernr?._text || '',
            Vorna: profile.Vorna?._text || '',
            Nachn: profile.Nachn?._text || '',
            Gesch: profile.Gesch?._text || '',
            Gbdat: profile.Gbdat?._text || '',
            Famst: profile.Famst?._text || '',
            Natio: profile.Natio?._text || '',
            Stras: profile.Stras?._text || '',
            Ort01: profile.Ort01?._text || '',
            Pstlz: profile.Pstlz?._text || '',
            Usrid: profile.Usrid?._text || '',
            Usrty: profile.Usrty?._text || '',
            Warks: profile.Warks?._text || '',
            Btrtl: profile.Btrtl?._text || '',
            Plans: profile.Plans?._text || ''
        });

    } catch (error) {
        console.error('SAP Error:', error.message);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

app.post('/emp_leave', async (req, res) => {
    const { id } = req.body;

    const SOAPbody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZfmEmpporLeavereq>
         <IvId>${id}</IvId>
      </urn:ZfmEmpporLeavereq>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_ep_leavereq_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = result['soap-env:Envelope']['soap-env:Body']['n0:ZfmEmpporLeavereqResponse']['EsLeavereq']['item'];

        const leaveList = Array.isArray(items) ? items.map(item => ({
            Pernr: item.Pernr?._text || '',
            Begda: item.Begda?._text || '',
            Endda: item.Endda?._text || '',
            Subty: item.Subty?._text || '',
            Aedtm: item.Aedtm?._text || '',
            Abwtg: item.Abwtg?._text || '',
            Umsch: item.Umsch?._text || '',
            Ktart: item.Ktart?._text || '',
            Anzhl: item.Anzhl?._text || '',
            Desta: item.Desta?._text || '',
            Deend: item.Deend?._text || ''
        })) : [];

        res.json({ leaves: leaveList });

    } catch (error) {
        console.error('SAP Error:', error.message);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

app.post('/payslip-data', async (req, res) => {
    const { id } = req.body;
    // const id = "00000003"

    const SOAPbody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZfmPayslipDataDg>
         <IPno>${id}</IPno>
      </urn:ZfmPayslipDataDg>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_ep_payslip_data_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const items = [result['soap-env:Envelope']['soap-env:Body']['n0:ZfmPayslipDataDgResponse']['EttPayslipDataDg']["item"]];

        const payslipList = items.map(item => ({
            Pernr: item.Pernr?._text || '',
            Bukrs: item.Bukrs?._text || '',
            Kostl: item.Kostl?._text || '',
            Stell: item.Stell?._text || '',
            Vorna: item.Vorna?._text || '',
            Gesch: item.Gesch?._text || '',
            Gbdat: item.Gbdat?._text || '',
            Natio: item.Natio?._text || '',
            Trfgr: item.Trfgr?._text || '',
            Trfst: item.Trfst?._text || '',
            Bet01: item.Bet01?._text || '',
            Lga01: item.Lga01?._text || '',
            Waers: item.Waers?._text || '',
            Divgv: item.Divgv?._text || ''
        }));


        res.json(payslipList);

    } catch (error) {
        console.error('SAP Error:', error.message);
        res.status(500).json({ error: "SAP error", detail: error.message });
    }
});

app.post('/payslippdf', async (req, res) => {
    const { IPno } = req.body;

    const SOAPbody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                                       xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
            <urn:ZfmPayslipDg>
                <IPno>${IPno}</IPno>
            </urn:ZfmPayslipDg>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zfm_ep_payslip_pdf_dg?sap-client=100',
            SOAPbody,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                }
            }
        );

        const result = convert.xml2js(response.data, { compact: true, spaces: 4 });

        const base64Data = result['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmPayslipDgResponse']
            ?.EvString?._text;

        if (!base64Data) {
            return res.status(404).json({ message: 'No PDF data found.' });
        }

        const pdfBuffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payslip_${IPno}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "SAP error", 
            detail: error.message,
            ...(error.response && { responseData: error.response.data })
        });
    }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Only if you encounter certificate issues
  }
});
app.post('/send-payslip', async (req, res) => {
    const { employeeId, to, from } = req.body;

    try {
        // First get the PDF from SAP
        const pdfResponse = await axios.post(
            `${SAP_BASE_URL}/sap/bc/srt/scs/sap/zfm_ep_payslip_pdf_dg?sap-client=${SAP_CLIENT}`,
            `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                             xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
                <soapenv:Header/>
                <soapenv:Body>
                    <urn:ZfmPayslipDg>
                        <IPno>${employeeId}</IPno>
                    </urn:ZfmPayslipDg>
                </soapenv:Body>
            </soapenv:Envelope>`,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': `Basic ${passKey}`
                },
                responseType: 'arraybuffer'
            }
        );

        const result = convert.xml2js(pdfResponse.data, { compact: true, spaces: 4 });
        const base64Data = result['soap-env:Envelope']['soap-env:Body']['n0:ZfmPayslipDgResponse'].EvString._text;
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        // Then send email with attachment
        await transporter.sendMail({
            from: from,
            to: to,
            subject: `Payslip for Employee ${employeeId}`,
            text: `Please find attached the payslip for employee ID: ${employeeId}`,
            html: `<p>Dear Recipient,</p>
                   <p>Please find attached the payslip for employee ID: ${employeeId}.</p>
                   <p>Best regards,</p>
                   <p>HR Department</p>`,
            attachments: [{
                filename: `payslip_${employeeId}.pdf`,
                content: pdfBuffer
            }]
        });

        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send email',
            detail: error.message,
            ...(error.response && { responseData: error.response.data })
        });
    }
});
// console.log('Email:', process.env.GMAIL_USER);
// console.log('Password:', process.env.GMAIL_PASSWORD);


app.listen(3000, () => console.log("Server running on Port:3000"));