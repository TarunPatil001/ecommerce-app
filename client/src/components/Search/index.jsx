// // import React from 'react'
import "./styles.css"
import Button from '@mui/material/Button';
import { useContext, useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { EXCLUDED_WORDS } from "../../utils/excludedWords";


const Search = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [localSearchData, setLocalSearchData] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);


  const excludedRegex = new RegExp(`\\b(${EXCLUDED_WORDS.join("|")})\\b`, "i");
  const specialCharsRegex = /[^\w\s-]/g;
  const abbreviationRegex = /\b([A-Z]\.){1,}[A-Z]?\b/g;

  const normalizeTerm = (text) => {
    if (!text) return '';
    // Skip normalization if the word is in excluded list
    if (excludedRegex.test(text)) return '';
    return String(text)
      .replace(abbreviationRegex, match => match.replace(/\./g, ''))
      .replace(specialCharsRegex, '')
      .toLowerCase()
      .trim();
  };

  const getQuickSuggestions = () => {
    if (!context?.isSearch || !localSearchData?.data) return [];

    const searchTerm = context.isSearch.trim().toLowerCase();
    if (searchTerm.length === 0 || excludedRegex.test(searchTerm)) return [];

    const searchWords = searchTerm.split(/\s+/)
      .filter(Boolean)
      .filter(word => !excludedRegex.test(word));

    if (searchWords.length === 0) return [];

    const suggestions = new Map();

    // Special handling for brand matches
    localSearchData.data.forEach(item => {
      if (item?.brand) {
        const brand = String(item.brand).toLowerCase();
        if (excludedRegex.test(brand)) return;

        const normalizedBrand = normalizeTerm(brand);
        if (!normalizedBrand) return;

        if (searchWords.every(sw => normalizedBrand.includes(normalizeTerm(sw)))) {
          if (normalizedBrand.includes('uspoloassn')) {
            suggestions.set('u.s. polo assn.', {
              text: 'u.s. polo assn.',
              score: 1000
            });
          }
          else if (!suggestions.has(brand)) {
            suggestions.set(brand, {
              text: brand,
              score: 100
            });
          }
        }
      }
    });

    // Other field matches with excluded words filtering
    localSearchData.data.forEach(item => {
      const fieldsToCheck = [
        { text: item?.name, score: 50 },
        { text: item?.categoryName, score: 30 },
        { text: item?.subCategoryName, score: 20 }
      ].filter(field => field.text && !excludedRegex.test(field.text));

      fieldsToCheck.forEach(({ text, score }) => {
        const cleanedText = String(text).toLowerCase();
        if (excludedRegex.test(cleanedText)) return;

        const words = cleanedText.split(/\s+/)
          .filter(word => word && !excludedRegex.test(word));

        // Single word matches
        words.forEach(word => {
          const normalizedWord = normalizeTerm(word);
          if (!normalizedWord) return;

          if (searchWords.some(sw => normalizedWord.startsWith(normalizeTerm(sw)))) {
            if (!suggestions.has(word)) {
              suggestions.set(word, {
                text: word,
                score: score + (word.length <= 3 ? 10 : 0)
              });
            }
          }
        });

        // Phrase matches (2-3 words)
        for (let i = 0; i < words.length - 1; i++) {
          for (let j = i + 1; j < Math.min(i + 3, words.length); j++) {
            const phrase = words.slice(i, j + 1).join(' ');
            const normalizedPhrase = normalizeTerm(phrase);
            if (!normalizedPhrase) continue;

            if (searchWords.every(sw => normalizedPhrase.includes(normalizeTerm(sw)))) {
              if (!suggestions.has(phrase)) {
                suggestions.set(phrase, {
                  text: phrase,
                  score: score - (j - i) * 5
                });
              }
            }
          }
        }
      });
    });

    // Final filtering of excluded words in suggestions
    const filteredSuggestions = Array.from(suggestions.values())
      .filter(item => !excludedRegex.test(item.text))
      .sort((a, b) => b.score - a.score || a.text.localeCompare(b.text))
      .map(item => item.text)
      .slice(0, 5);

    return filteredSuggestions;
  };

  const quickSuggestions = getQuickSuggestions();




  // Handle input change
const onChangeInput = (e) => {
  const value = e.target.value;
  context?.setIsSearch(value);
};

// Search function
const search = async (query, type = "typing") => {
  const trimmedQuery = query?.trim();
  
  // Clear results if query is empty
  if (!trimmedQuery) {
    setLocalSearchData([]);
    if (type === "enter") {
      context?.setSearchData([]);
      context?.setSearchQuery("");
    }
    return;
  }

  try {
    const obj = {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      query: trimmedQuery,
    };

    // Show loading for at least 500ms to prevent flickering
    const searchStartTime = Date.now();
    const isLoading = type === "enter" ? setSearchLoading : setLoading;
    isLoading(true);

    const res = await postData(`/api/product/search/get`, obj);

    // Calculate remaining time to reach 500ms
    const elapsedTime = Date.now() - searchStartTime;
    const remainingTime = Math.max(0, 500 - elapsedTime);
    await new Promise(resolve => setTimeout(resolve, remainingTime));

    if (type === "enter") {
      // Only update context on explicit search (Enter/button click)
      context?.setSearchData(res);
      context?.setSearchQuery(trimmedQuery);
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // Store typing results locally
      setLocalSearchData(res);
    }
  } catch (error) {
    console.error("Search request failed:", error);
    // Optionally set error state here
  } finally {
    const isLoading = type === "enter" ? setSearchLoading : setLoading;
    isLoading(false);
  }
};

// Debounced search when input changes
useEffect(() => {
  const timer = setTimeout(() => {
    if (context?.isSearch !== undefined) {
      search(context.isSearch, "typing");
    }
  }, 500);

  return () => clearTimeout(timer);
}, [context?.isSearch]);

// Handle Enter key press
const onKeyDown = (e) => {
  if (e.key === "Enter" && !searchLoading) {
    search(context?.isSearch, "enter");
    setIsFocused(false);
    inputRef.current?.blur();
  }
};

// Handle search button click
const handleSearchClick = () => {
  if (!searchLoading) {
    search(context?.isSearch, "enter");
    setIsFocused(false);
    inputRef.current?.blur();
  }
};

  // Initial load from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get("q");
    if (queryFromUrl) {
      context?.setIsSearch(queryFromUrl);
      search(queryFromUrl, "enter");
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-md relative p-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
          value={context?.isSearch || ""}
          onChange={onChangeInput}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onClick={() => setIsFocused(true)}
        />
        <Button
          className="!absolute top-[8px] right-[5px] z-50 w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"
          onClick={handleSearchClick}
          aria-label="Search"
          disabled={searchLoading}
        >
          {searchLoading ? (
            <CircularProgress size={20} />
          ) : (
            <IoSearch className="text-[#4e4e4e] text-[22px] link" />
          )}
        </Button>
      </div>

      {/* Dropdown with suggestions and results */}
      {isFocused && context?.isSearch && (
        <ul className="suggestionBox absolute top-[55px] left-0 w-full border rounded-md bg-white max-h-[450px] overflow-y-auto shadow-lg z-[1000]">
          {loading ? (
            <li className="p-2 text-center flex justify-center">
              <CircularProgress size={20} />
            </li>
          ) : (
            <>
              {quickSuggestions.length > 0 && (
                <div className="border-b p-2">
                  <p className="text-xs font-semibold text-gray-500 mb-1">QUICK SUGGESTIONS</p>
                  {quickSuggestions.map((suggestion, index) => (
                    <li
                      key={`suggestion-${index}`}
                      className="p-2 flex gap-3 items-center cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        context?.setIsSearch(suggestion);
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        search(suggestion, "enter");
                        setIsFocused(false);
                      }}
                    >
                      <IoSearch className="text-[#4e4e4e] text-[22px] link" />
                      <div>
                        <p className="text-[14px] font-semibold">
                          {suggestion}
                        </p>
                      </div>
                    </li>
                  ))}
                </div>
              )}

              <div className="p-2">
                {localSearchData?.data?.length > 0 ? (
                  localSearchData.data.map((item) => (
                    <li
                      key={item._id}
                      className="p-2 flex gap-3 items-center border-b border-[rgba(0,0,0,0.05)] last:border-b-0 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                        setIsFocused(false);
                      }}
                    >
                      <img src={item.images[0]} alt={item.name} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <p className="text-[14px] font-semibold line-clamp-1">
                          {item.name} ({item.brand})
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center">
                    {context?.isSearch.trim() ? "No products found." : "Type to search"}
                  </li>
                )}
              </div>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Search;

