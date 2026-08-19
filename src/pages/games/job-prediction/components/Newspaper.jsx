import AgingTransition from "./AgingTransition";
import styles from "./Newspaper.module.css";

const Newspaper = ({ data, mark, fromImage }) => {
  return (
    <div className={styles.newspaperContainer}>
      <div className={styles.newspaper}>
        {/* Masthead */}
        <header className={styles.masthead}>
          <div className={styles.topLine} />

          <h1 className={styles.newspaperTitle}>NEWPOST YORK</h1>

          <div className={styles.dateLine}>
            YORK, MA — THURSDAY AUGUST 30, 1978 — SEVEN PAGES
          </div>
        </header>

        {/* Main content */}
        <main className={styles.mainGrid}>
          {/* LEFT */}
          <section className={styles.leftArticle}>
            <div className={styles.sectionLabel}>TIN TỨC ĐẶC BIỆT</div>

            <h2 className={styles.mainHeadline}>CONGRATULATIONS</h2>

            <div className={styles.headlineSubtitle}>
              <span />

              <em>Một cột mốc đáng tự hào đã được chinh phục</em>

              <span />
            </div>

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

            <div className={styles.careerSubtitle}>
              Building the infrastructure behind modern intelligent systems
            </div>

            <div className={styles.byline}>BỞI KHOA VIỄN THÔNG 1</div>

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
                <p className={styles.dropCap}>
                  Chịu trách nhiệm thiết kế, xây dựng và quản lý hạ tầng dữ liệu
                  quy mô lớn; tối ưu hóa các đường ống dẫn dữ liệu (data
                  pipelines) giúp doanh nghiệp biến dữ liệu thô thành thông tin
                  có giá trị cao cho các quyết định chiến lược.
                </p>

                <div className={styles.responsibilityBlock}>
                  <h3>KEY RESPONSIBILITIES</h3>

                  <ul>
                    <li>
                      Thiết kế và xây dựng hệ thống dữ liệu hiệu quả, có khả
                      năng mở rộng.
                    </li>

                    <li>
                      Đảm bảo chất lượng, tính toàn vẹn và bảo mật của dữ liệu.
                    </li>

                    <li>
                      Tối ưu hóa pipeline dữ liệu cho phân tích và machine
                      learning.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className={styles.newspaperFooter}>
          <div className={styles.footerTitle}>INSIDE THIS ISSUE</div>

          <div className={styles.footerItem}>
            <strong>Tech Trends</strong>
            <span>Shaping Tomorrow</span>
            <span>Page 2</span>
          </div>

          <div className={styles.footerItem}>
            <strong>The Power of</strong>
            <span>Continuous Learning</span>
            <span>Page 3</span>
          </div>

          <div className={styles.footerItem}>
            <strong>Careers in Tech:</strong>
            <span>Opportunities Ahead</span>
            <span>Page 5</span>
          </div>

          <div className={styles.footerItem}>
            <strong>Interview with</strong>
            <span>Industry Experts</span>
            <span>Page 7</span>
          </div>

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
