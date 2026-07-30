import React, { useRef, useState } from "react";
import api from "../api/api";

const CertificateCard = ({ userName, partnerName, skillName }) => {
  const [certificate, setCertificate] = useState(null);
  const certificateRef = useRef(null);

  const generateCertificate = async () => {
    try {
      const { data } = await api.post("/certificates", {
        userName,
        partnerName,
        skillName,
        completedDate: new Date().toLocaleDateString()
      });

      setCertificate(data.certificate);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate certificate");
    }
  };

  const handlePrint = () => {
    if (!certificateRef.current) return;

    const printContents = certificateRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=1000,height=750");

    printWindow.document.write(`
      <html>
        <head>
          <title>SkillSwap Certificate</title>
          <style>
            body {
              margin: 0;
              padding: 32px;
              background: #f6f3ee;
              font-family: Arial, sans-serif;
            }

            .certificate-wrap {
              max-width: 950px;
              margin: auto;
              background: white;
              border-radius: 24px;
              padding: 24px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-wrap">
            ${printContents}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="card shadow-sm border-0 p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow mb-1">Achievement</div>
          <h4 className="fw-bold mb-0">Certificate Of Completion</h4>
        </div>

        {certificate && (
          <button className="btn btn-primary" onClick={handlePrint}>
            Download / Print
          </button>
        )}
      </div>

      {!certificate ? (
        <div className="text-center py-4">
          <p className="text-muted mb-4">
            Generate a professional certificate for a completed skill exchange.
          </p>

          <button className="btn btn-warning px-4" onClick={generateCertificate}>
            Generate Certificate
          </button>
        </div>
      ) : (
        <div
          ref={certificateRef}
          className="rounded-5 p-4 p-lg-5 mt-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(29,78,216,0.06), rgba(217,119,6,0.08))",
            border: "1px solid rgba(24,32,38,0.08)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(37,99,235,0.08)"
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              left: "-40px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(245,158,11,0.08)"
            }}
          />

          <div className="text-center" style={{ position: "relative", zIndex: 2 }}>
            <div className="section-eyebrow mb-2">SkillSwap</div>
            <h2 className="fw-bold mb-3" style={{ fontSize: "2.4rem" }}>
              {certificate.title}
            </h2>

            <p className="text-muted mb-2">This certificate is proudly presented to</p>

            <h1
              className="fw-bold mb-3"
              style={{ color: "#1d4ed8", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
            >
              {certificate.userName}
            </h1>

            <p className="text-muted mb-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
              for successfully completing a collaborative skill exchange in
            </p>

            <div
              className="d-inline-block px-4 py-2 rounded-pill fw-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff",
                fontSize: "1.05rem"
              }}
            >
              {certificate.skillName}
            </div>

            <p className="text-muted mb-4">
              in partnership with <strong>{certificate.partnerName}</strong>
            </p>

            <div className="row justify-content-center mt-4">
              <div className="col-md-4 mb-3">
                <div className="rounded-4 bg-white p-3 shadow-sm">
                  <small className="text-muted d-block mb-1">Issued By</small>
                  <strong>SkillSwap Platform</strong>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="rounded-4 bg-white p-3 shadow-sm">
                  <small className="text-muted d-block mb-1">Completion Date</small>
                  <strong>{certificate.completedDate}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3">
              <div
                style={{
                  width: "180px",
                  height: "2px",
                  background: "#182026",
                  margin: "0 auto 8px"
                }}
              />
              <div className="fw-semibold">Authorized By SkillSwap</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;
