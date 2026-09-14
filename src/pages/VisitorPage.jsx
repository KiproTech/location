import { useState } from "react";
import Header from "../components/Header.jsx";
import ConsentCard from "../components/ConsentCard.jsx";
import LocationStatus from "../components/LocationStatus.jsx";
import DeviceInfo from "../components/DeviceInfo.jsx";
import { getCurrentLocation, LOCATION_ERROR } from "../services/locationService.js";
import { getDeviceInfo } from "../services/deviceInfo.js";
import { getSessionId } from "../services/sessionService.js";

// status: "idle" | "cancelled" | "requesting" | "granted" | "error"
export default function VisitorPage() {
  const [status, setStatus] = useState("idle");
  const [visitorData, setVisitorData] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  async function requestLocation() {
    setStatus("requesting");
    setErrorCode(null);

    try {
      const location = await getCurrentLocation();
      const device = getDeviceInfo();

      // Combined object for this visit. This stays in React/browser
      // memory only — Part 4 will decide what (if anything) gets sent
      // to Supabase, and only after this stage exists cleanly on its own.
      const combined = {
        sessionId: getSessionId(),
        location,
        device,
      };

      // Local testing only — nothing here is sent to a server.
      // eslint-disable-next-line no-console
      console.log("Visitor data (not sent anywhere):", combined);

      setVisitorData(combined);
      setStatus("granted");
    } catch (error) {
      setErrorCode(error.code || LOCATION_ERROR.UNKNOWN);
      setStatus("error");
    }
  }

  function handleAllow() {
    requestLocation();
  }

  function handleCancel() {
    setStatus("cancelled");
    setVisitorData(null);
    setErrorCode(null);
  }

  function handleRetry() {
    requestLocation();
  }

  return (
    <div className="visitor-page">
      <Header />
      <main className="visitor-page__main">
        <div className="visitor-page__card">
          <ConsentCard
            isRequesting={status === "requesting"}
            onAllow={handleAllow}
            onCancel={handleCancel}
          />

          <div className="visitor-page__status">
            {status === "cancelled" ? (
              <p className="location-status location-status--muted">
                You chose not to continue.
              </p>
            ) : (
              <LocationStatus
                status={status}
                data={visitorData?.location ?? null}
                errorCode={errorCode}
                onRetry={status === "error" ? handleRetry : null}
              />
            )}

            {status === "granted" && visitorData && (
              <div className="visitor-page__device">
                <DeviceInfo data={visitorData.device} />
                <p className="visitor-page__disclosure">
                  The information shown above is available through your
                  browser and was collected after you chose to continue.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .visitor-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .visitor-page__main {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 28px 16px 40px;
        }

        .visitor-page__card {
          width: 100%;
          max-width: 480px;
        }

        .visitor-page__status {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .visitor-page__disclosure {
          margin: 10px 0 0;
          font-size: 0.78rem;
          color: var(--color-ink-soft);
        }

        @media (min-width: 560px) {
          .visitor-page__main {
            padding-top: 48px;
          }
        }
      `}</style>
    </div>
  );
}
