import "../Styles/Conditions.css";

const TermsAndConditions = () => {
  return (
    <div className="conditions-container">
      <h2 className="conditions-title">Terms and Conditions</h2>
      <div className="conditions-content">
        <p>
          By using this service, you agree to the following terms and conditions.
          Please read them carefully.
        </p>
        <h3>1. General</h3>
        <p>
          This website provides information on various projects. The content is
          subject to change without notice.
        </p>
        <h3>2. Data Usage</h3>
        <p>
          We collect and store information based on user interactions. This data
          may be used for service improvements.
        </p>
        <h3>3. Liability</h3>
        <p>
          We are not responsible for any issues caused by using this platform.
        </p>
        <h3>4. Changes</h3>
        <p>
          The terms and conditions may be updated from time to time without prior
          notice.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;