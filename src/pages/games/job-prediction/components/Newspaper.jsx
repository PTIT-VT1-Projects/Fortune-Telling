import AgingTransition from "./AgingTransition";
import styles from "./Newspaper.module.css";

const Newspaper = ({ data, mark, fromImage }) => {
  return (
    <div className={styles.newspaperContainer}>
      <div className={styles.newspaper}>
        {/* Masthead */}
        <header className={styles.masthead}>
          <div className={styles.topLine} />

          <h1 className={styles.newspaperTitle}>VIETNAM POST</h1>

          <div className={styles.dateLine}>Hà Nội, Việt Nam — 2030</div>
        </header>

        {/* Main content */}
        <main className={styles.mainGrid}>
          {/* LEFT */}
          <section className={styles.leftArticle}>
            <div className={styles.sectionLabel}>TIN TỨC ĐẶC BIỆT</div>

            <h2 className={styles.mainHeadline}>
              🌟 XUẤT HIỆN NGÔI SAO MỚI NỔI 🌟
            </h2>
            <br />

            <div className={styles.congratulationGrid}>
              {/* Left text */}
              <div className={styles.articleColumn}>
                <p className={styles.dropCap}>${data.congratulationText}</p>

                <div className={styles.scoreArea}>
                  <div className={styles.scoreDecoration}>
                    <span className={`${styles.leaf} ${styles.leafLeft}`}>
                      ❧
                    </span>

                    <div className={styles.scoreStamp}>
                      <div className={styles.scoreInner}>{mark}</div>
                    </div>

                    <span className={`${styles.leaf} ${styles.leafRight}`}>
                      ❧
                    </span>
                  </div>

                  <div className={styles.scoreLabel}>GPA</div>

                  <div className={styles.scoreValue}>{mark} / 4</div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className={styles.careerArticle}>
            <div className={styles.sectionLabel}>DỰ ĐOÁN NGHỀ NGHIỆP</div>

            <h2 className={styles.careerTitle}>{data.futureJob}</h2>

            <div className={styles.byline}>KHOA VIỄN THÔNG 1</div>

            <div className={styles.careerContent}>
              <figure className={styles.careerImage}>
                <div className={styles.careerImageBox}>
                  <AgingTransition
                    fromImage={fromImage}
                    toImage={data.generatedImage}
                    duration={5000}
                    width={300}
                    height={300}
                  />
                </div>
              </figure>

              <div className={styles.careerText}>
                <p className={styles.dropCap}>{data.futureJobDescription}</p>

                <div className={styles.responsibilityBlock}>
                  <h3>CÔNG VIỆC CHÍNH</h3>

                  <ul>
                    {data.keyResponsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className={styles.newspaperFooter}>
          <div className={styles.footerTitle}>TRONG SỐ NÀY</div>

          {data.furtherReadings.map((item, index) => {
            return (
              <div key={index} className={styles.footerItem}>
                <strong>{item.title}</strong>
                <span>{item.content}</span>
                <span>Trang 2</span>
              </div>
            );
          })}

          <div className={styles.footerQuote}>
            <em>
              “Success is not final, failure is not fatal:
              <br />
              it is the courage to continue that counts.”
            </em>

            <span>— WINSTON CHURCHILL</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Newspaper;
