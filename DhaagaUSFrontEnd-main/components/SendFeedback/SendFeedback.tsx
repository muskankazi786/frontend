import {
  ChangeEvent,
  MouseEvent,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import { useErrorBoundary } from "react-error-boundary";

import styles from "../../styles/SendFeedback.module.css";
import ToastModal from "../ToastModal/ToastModal";
import useTextArea from "@/hooks/useTextArea";
import {
  isNotEmpty,
  isNotMoreThanSaidLimit,
} from "@/utils/validation/conditions";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

const initialProblemFlagsToggleState = {
  saveProblem: false,
  crash: false,
  lags: false,
  badQuality: false,
  bugsAndOthers: false,
  ads: false,
  suggestion: false,
};

const SendFeedback = () => {
  //  Problem description input's useTextAreaHook

  const {
    value: enteredProblemDescription,
    wordCount: problemDescriptionWordCount,
    isValid: problemDescriptionIsValid,
    hasError: problemDescriptionInputHasError,
    errorText: problemDescriptionInputErrorText,
    valueChangeHandler: problemDescriptionInputChangeHandler,
    inputBlurHandler: problemDescriptionInputBlurHandler,
    inputTouchHandler: problemDescriptionInputTouchHandler,
    inputResetHandler: problemDescriptionInputResetHandler,
  } = useTextArea((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 200)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Please describe the problem" };
    } else {
      return {
        valid: false,
        errorText: "Must be at most 200 characters",
      };
    }
  });

  const [problemFlags, setProblemFlags] = useState<string[]>([]);
  const [problemFlagsToggle, setProblemFlagsToggle] = useState<{
    [key: string]: boolean;
  }>(initialProblemFlagsToggleState);
  const [fileList, setFileList] = useState<FileList>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reqResponse, setRequestResponse] = useState<{
    success?: string;
    error?: string;
  } | null>(null);
  const [show, setShow] = useState(false);

  const problemDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const attachmentFileInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const { showBoundary } = useErrorBoundary();

  const problemFlagChangeHandler = (e: MouseEvent<HTMLButtonElement>) => {
    const id = (e.target as HTMLButtonElement).id;
    const name = (e.target as HTMLButtonElement).name;
    setProblemFlagsToggle((prevState) => {
      if (prevState[id] === false) {
        setProblemFlags((prevState) => [...prevState, name]);
      } else {
        setProblemFlags((prevState) =>
          prevState.filter((item) => item !== name)
        );
      }
      return { ...prevState, [id]: !prevState[id] };
    });
  };

  // const descriptionInputHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   setProblemDescription(e.target.value);
  //   setTextAreaWordCount(e.target.value.length);
  // };

  const attachmentChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    setFileList(files);
  };

  const feedbackFormSubmitHandler = async () => {
    problemDescriptionInputTouchHandler();

    if (!problemDescriptionIsValid) {
      setTimeout(() => {
        problemDescriptionInputRef.current!.focus();
      }, 0);
      return;
    }

    setIsSubmitting(true);
    setRequestResponse(null);
    setShow(true);
    const formDataObject: any = {};

    formDataObject["problemFlags"] = problemFlags;
    formDataObject["problemDescription"] = enteredProblemDescription;
    let attachmentFiles: string[] = [];

    if (fileList !== undefined && Object.keys(fileList).length) {
      const fetchPreSignedUrl = async (file: File) => {
        const fetchSignedUrlRes = await catchAsyncFetch(
          `/api/getSignedUploadAttachmentUrl?file=${file.name}&type=${file.type}`,
          showBoundary
        );

        if (!fetchSignedUrlRes) {
          throw new Error("Fetch failed!");
        }

        const data = await fetchSignedUrlRes.json();

        if (!fetchSignedUrlRes.ok) {
          throw new Error(data.message);
        }

        const { url, fields } = data;

        const formDataForTheFile = new FormData();

        Object.entries({ ...fields, file }).forEach(([key, value]) => {
          formDataForTheFile.append(key, value as string);
        });

        const uploadResponse = await catchAsyncFetch(url, showBoundary, {
          method: "POST",
          body: formDataForTheFile,
        });

        if (!uploadResponse) {
          throw new Error("Fetch failed!");
        }

        if (uploadResponse.ok) {
          return { key: fields.key };
        } else {
          throw new Error("Uploading file failed");
        }
      };

      const promiseArray = [];
      for (let i = 0; i < Object.keys(fileList).length; i++) {
        const file = fileList[i];
        promiseArray.push(fetchPreSignedUrl(file));
      }

      try {
        const values = await Promise.all(promiseArray);
        for (let value of values) {
          const key = value.key;
          const url = `https://s3.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${key}`;
          attachmentFiles.push(url);
        }
      } catch (error: any) {
        setRequestResponse({ error: error.message });
        setIsSubmitting(false);
        return;
      }
    }
    formDataObject["attachmentFiles"] = attachmentFiles;

    const res = await catchAsyncFetch("/api/createFeedback", showBoundary, {
      method: "POST",
      body: JSON.stringify(formDataObject),
    });

    if (!res) {
      return;
    }

    const data = await res.json();
    if (res.ok) {
      setRequestResponse({ success: data.message });
      setProblemFlags([]);
      setProblemFlagsToggle(initialProblemFlagsToggleState);
      problemDescriptionInputResetHandler();
      attachmentFileInputRef.current!.value = "";
    } else {
      setRequestResponse({ error: data.message });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {reqResponse && reqResponse.success && show && (
        <ToastModal
          variant="success"
          header="Success"
          body={reqResponse.success}
          show={show}
          onClose={() => setShow(false)}
        />
      )}
      {reqResponse && reqResponse.error && show && (
        <ToastModal
          variant="danger"
          header="Error!"
          body={reqResponse.error}
          show={show}
          onClose={() => setShow(false)}
        />
      )}
      <div className={styles.label}>Send Feedback</div>
      <form className={styles["form"]}>
        <div>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0003 29.3346C11.2003 29.3346 10.667 28.8013 10.667 28.0013V24.0013H5.33366C3.86699 24.0013 2.66699 22.8013 2.66699 21.3346V5.33464C2.66699 3.86797 3.86699 2.66797 5.33366 2.66797H26.667C28.1337 2.66797 29.3337 3.86797 29.3337 5.33464V21.3346C29.3337 22.8013 28.1337 24.0013 26.667 24.0013H18.5337L13.6003 28.9346C13.3337 29.2013 13.067 29.3346 12.667 29.3346H12.0003ZM13.3337 21.3346V25.468L17.467 21.3346H26.667V5.33464H5.33366V21.3346H13.3337ZM21.7337 8.0013L19.867 12.0013H22.667V17.3346H17.3337V11.7346L19.067 8.0013H21.7337ZM13.7337 8.0013L11.867 12.0013H14.667V17.3346H9.33366V11.7346L11.067 8.0013H13.7337Z"
              fill="#7A52D3"
            />
          </svg>
        </div>
        <div className="d-flex flex-column" style={{ gap: 32 }}>
          <div className="d-flex flex-column" style={{ gap: 16 }}>
            <div className={styles["tell-us"]}>
              Tell us the problem you encountered
            </div>
            <div className="d-flex flex-wrap" style={{ gap: 10 }}>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.saveProblem ? styles["active"] : ""
                }`}
                id="saveProblem"
                name="save-problem"
                onClick={problemFlagChangeHandler}
              >
                Save Problem
              </button>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.crash ? styles["active"] : ""
                }`}
                id="crash"
                name="crash"
                onClick={problemFlagChangeHandler}
              >
                Crash
              </button>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.lags ? styles["active"] : ""
                }`}
                id="lags"
                name="lags"
                onClick={problemFlagChangeHandler}
              >
                Lags
              </button>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.badQuality ? styles["active"] : ""
                }`}
                id="badQuality"
                name="bad-quality"
                onClick={problemFlagChangeHandler}
              >
                Bad Quality
              </button>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.bugsAndOthers ? styles["active"] : ""
                }`}
                id="bugsAndOthers"
                name="bugs-and-others"
                onClick={problemFlagChangeHandler}
              >
                Bugs, Others
              </button>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.ads ? styles["active"] : ""
                }`}
                id="ads"
                name="ads"
                onClick={problemFlagChangeHandler}
              >
                Ads
              </button>
              <button
                type="button"
                className={`${styles["flag"]} ${
                  problemFlagsToggle.suggestion ? styles["active"] : ""
                }`}
                id="suggestion"
                name="suggestion"
                onClick={problemFlagChangeHandler}
              >
                Suggestion
              </button>
            </div>
          </div>
          <div className="d-flex flex-column" style={{ gap: 13 }}>
            <div
              className={`d-flex flex-column ${styles.controls} ${
                problemDescriptionInputHasError ? styles["invalid"] : ""
              }`}
              style={{ gap: 4 }}
            >
              <div className={styles["desc-label"]}>
                <label htmlFor="description">Description</label>
                <span>{`${problemDescriptionWordCount}/200`}</span>
              </div>
              <textarea
                id="description"
                rows={4}
                maxLength={200}
                ref={problemDescriptionInputRef}
                value={enteredProblemDescription}
                onChange={problemDescriptionInputChangeHandler}
                onBlur={problemDescriptionInputBlurHandler}
              />
              {problemDescriptionInputHasError && (
                <p className={styles["error-text"]}>
                  {problemDescriptionInputErrorText}
                </p>
              )}
            </div>
            <div className={styles["attachments"]}>
              <label htmlFor="attachment">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.8283 7.75493L9.17229 13.4119C9.07678 13.5042 9.00059 13.6145 8.94819 13.7365C8.89578 13.8585 8.86819 13.9898 8.86704 14.1225C8.86588 14.2553 8.89118 14.387 8.94147 14.5099C8.99175 14.6328 9.066 14.7444 9.15989 14.8383C9.25378 14.9322 9.36544 15.0065 9.48833 15.0568C9.61123 15.107 9.74291 15.1323 9.87569 15.1312C10.0085 15.13 10.1397 15.1024 10.2617 15.05C10.3837 14.9976 10.494 14.9214 10.5863 14.8259L16.2433 9.16993C16.8059 8.60728 17.122 7.84415 17.122 7.04843C17.122 6.25272 16.8059 5.48959 16.2433 4.92693C15.6806 4.36428 14.9175 4.04818 14.1218 4.04818C13.3261 4.04818 12.5629 4.36428 12.0003 4.92693L6.34329 10.5839C5.86936 11.0461 5.49192 11.5977 5.23284 12.2068C4.97377 12.816 4.83823 13.4705 4.83408 14.1324C4.82994 14.7943 4.95727 15.4505 5.20868 16.0628C5.4601 16.6752 5.83061 17.2315 6.2987 17.6995C6.7668 18.1676 7.32317 18.538 7.93554 18.7893C8.54791 19.0406 9.20409 19.1679 9.86602 19.1636C10.5279 19.1594 11.1824 19.0238 11.7915 18.7646C12.4006 18.5054 12.9522 18.1279 13.4143 17.6539L19.0713 11.9979L20.4853 13.4119L14.8283 19.0689C14.1782 19.719 13.4065 20.2346 12.5572 20.5864C11.7079 20.9382 10.7976 21.1193 9.87829 21.1193C8.95899 21.1193 8.04869 20.9382 7.19937 20.5864C6.35004 20.2346 5.57833 19.719 4.92829 19.0689C4.27824 18.4189 3.7626 17.6472 3.4108 16.7979C3.059 15.9485 2.87793 15.0382 2.87793 14.1189C2.87793 13.1996 3.059 12.2893 3.4108 11.44C3.7626 10.5907 4.27824 9.81898 4.92829 9.16893L10.5863 3.51293C11.5293 2.60214 12.7923 2.09817 14.1033 2.10956C15.4143 2.12096 16.6683 2.6468 17.5954 3.57384C18.5224 4.50088 19.0483 5.75494 19.0597 7.06593C19.071 8.37691 18.5671 9.63992 17.6563 10.5829L12.0003 16.2419C11.7216 16.5205 11.3908 16.7415 11.0267 16.8923C10.6627 17.043 10.2725 17.1206 9.87843 17.1205C9.48439 17.1205 9.09421 17.0428 8.73018 16.892C8.36615 16.7412 8.03539 16.5201 7.75679 16.2414C7.47819 15.9628 7.2572 15.632 7.10645 15.2679C6.9557 14.9038 6.87813 14.5136 6.87818 14.1196C6.87823 13.7255 6.95588 13.3354 7.10672 12.9713C7.25756 12.6073 7.47862 12.2765 7.75729 11.9979L13.4143 6.34093L14.8283 7.75493Z"
                    fill="#9371DB"
                  />
                </svg>
                Add Attachment
              </label>
              <input
                type="file"
                id="attachment"
                onChange={attachmentChangeHandler}
                ref={attachmentFileInputRef}
                multiple
              />
              {fileList !== undefined && Object.keys(fileList).length > 0 && (
                <div className={styles["selected-file"]}>
                  {`selected ${Object.keys(fileList!).length} files`}
                </div>
              )}
            </div>
          </div>
          <div
            className={`${styles["submit"]} ${
              isSubmitting ? styles["submitting"] : ""
            }`}
          >
            <button
              type="button"
              onMouseDown={(e) => {
                if (e.button === 0) {
                  feedbackFormSubmitHandler();
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendFeedback;
