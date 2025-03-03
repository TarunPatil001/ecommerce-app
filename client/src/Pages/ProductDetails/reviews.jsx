import { useContext, useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Button, CircularProgress, Rating, TextField } from "@mui/material";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Reviews = (props) => {
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [reviewData, setReviewData] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    // Set a word limit (you can change it as needed)
    const wordLimit = 30;

    const [reviews, setReviews] = useState({
        image: "",
        userName: "",
        review: "",
        rating: "",
        userId: "",
        productId: "",
    });

    // Set initial user data when context or product ID changes
    useEffect(() => {
        if (context?.userData) {
            setReviews((prev) => ({
                ...prev,
                image: context?.userData?.avatar,
                userName: context?.userData?.name,
                userId: context?.userData?._id,
                productId: props?.productId,
            }));
        }
        getReviews();
    }, [context?.userData, props?.productId]);

    const onChangeInput = (e) => {
        setReviews((prev) => ({
            ...prev,
            review: e.target.value,
        }));
    };

    // Format the date as "14-Feb-2025"
    const formatDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-GB", options).replace(",", "");
    };

    // Time ago function to calculate relative time
    const timeAgo = (date) => {
        const diff = Math.floor((new Date() - new Date(date)) / 1000);

        if (diff < 0) return "Just now";
        if (diff < 60) return `${diff} sec${diff !== 1 ? "s" : ""} ago`;

        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

        const years = Math.floor(months / 12);
        return `${years} year${years !== 1 ? "s" : ""} ago`;
    };

    // Refresh timeAgo every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setReviewData((prevReviews) =>
                prevReviews.map((review) => ({
                    ...review,
                    timeAgo: timeAgo(review.createdAt),
                }))
            );
        }, 60000); // Refresh every 60 seconds

        return () => clearInterval(interval);
    }, [reviewData]);

    // Fetch reviews
    const getReviews = async () => {
        try {
            const res = await fetchDataFromApi(`/api/user/getReviews?productId=${props?.productId}`);
            if (res?.error) throw new Error(res?.message || "Failed to fetch reviews.");
            setReviewData(res?.data || []);
            props?.setReviewsCount(res?.data?.length);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    // Add new review
    const addReview = async (e) => {
        e.preventDefault();

        let missingFields = [];
        if (!reviews.review) missingFields.push("Write a review!");
        if (!reviews.rating) missingFields.push("Rate the product!");

        if (missingFields.length > 0) {
            context.openAlertBox("error", missingFields.join(", ").replace(/, ([^,]*)$/, " and $1"));
            return;
        }

        setIsLoading(true);
        try {
            await toast.promise(
                postData("/api/user/addReview", reviews),
                {
                    loading: "Submitting review...",
                    success: (res) => {
                        if (res?.error) throw new Error(res?.message || "Failed to add review.");
                        setReviews({ review: "", rating: 1 });
                        getReviews();
                        return "Review added successfully!";
                    },
                    error: (err) => err?.message || "An unexpected error occurred.",
                }
            );
        } catch (error) {
            toast.error(error.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full productReviewsContainer">
            <h4 className="font-bold text-[16px] mb-2">Customer questions and answers</h4>
            <div className="reviewScroll w-full max-h-[1000px] overflow-y-scroll overflow-x-hidden customScroll pr-5">
                {reviewData.length !== 0 ? (
                    reviewData.map((review, index) => (
                        <div className="review w-full flex items-start justify-between p-5 border-b gap-2" key={index}>
                            <div className="info w-[80%] flex items-start gap-3">
                                <div className="img w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                    <img
                                        src={review.image}
                                        alt="user_img"
                                        className="absolute w-full h-full object-cover"
                                        onError={(e) => e.target.src = "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"}
                                    />
                                </div>
                                <div className="w-[80%]">
                                    <h4 className="font-semibold text-[16px]">{review.userName}</h4>
                                    <h5 className="font-semibold text-[14px] mb-1">
                                        {formatDate(review?.createdAt)} &#x2022; {timeAgo(review?.createdAt)}
                                    </h5>
                                    <p className="text-[14px] text-justify">
                                        {isExpanded ? review?.review : review?.review.split(" ").slice(0, wordLimit).join(" ") + (review?.review.split(" ").length > wordLimit ? "..." : "")}
                                    </p>

                                    {review?.review.split(" ").length > wordLimit && (
                                        <button
                                            className="text-[var(--bg-primary)] hover:underline underline-offset-2 mt-1"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                        >
                                            {isExpanded ? "Read Less" : "Read More"}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="w-[20%]">
                                <Rating name="size-medium" value={review?.rating || 0} readOnly />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full border rounded-md flex items-center justify-center p-5 gap-2">
                        <span>Be the first to review this product!</span>
                    </div>
                )}
            </div>

            <br />

            {context?.isLogin ? (
                <div className="reviewForm bg-[#fafafa] p-4 rounded-md w-full flex flex-col items-start gap-2">
                    <form className="w-full flex flex-col gap-5" onSubmit={addReview}>
                        <TextField
                            label="Add a review"
                            placeholder="Your feedback helps us improve!"
                            multiline
                            className="w-full textfieldReview"
                            onChange={onChangeInput}
                            name="review"
                            value={reviews.review}
                        />
                        <div className="flex items-center justify-between gap-1">
                            <Rating
                                name="ratingStar"
                                size="large"
                                value={reviews.rating}
                                onChange={(e, value) =>
                                    setReviews((prev) => ({ ...prev, rating: value }))
                                }
                            />
                            <Button type="submit" className="!text-white !bg-yellow-400 !h-[40px] w-52 !text-[16px] flex items-center justify-center gap-1">
                                {isLoading ? <CircularProgress sx={{ color: "gray" }} /> : <><BsPencilSquare className="text-[16px]" /> Submit Review</>}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="w-full border rounded-md flex items-center justify-center p-5 gap-2">
                    Please <Link to="/login" className="hover:underline text-[var(--bg-primary)]">login</Link> to write a review.
                </div>
            )}
        </div>
    );
};


Reviews.propTypes = {
    productId: PropTypes.string.isRequired, // Ensures productId is a string
    setReviewsCount: PropTypes.func.isRequired, // Ensures setReviewsCount is a function
};

export default Reviews;
