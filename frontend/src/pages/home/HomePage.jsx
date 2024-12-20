import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
    return (
<div className="relative flex size-full min-h-screen flex-col bg-[#141414] dark group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292929] px-10 py-3">
          <div className="flex items-center gap-4 text-[#FFFFFF]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="white"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#FFFFFF] text-lg font-bold leading-tight tracking-[-0.015em]">SwapIt</h2>
          </div>
          <div className="flex-1 justify-center gap-8 ">
            <div className="flex items-center gap-9 justify-end">
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal hidden" href="#">Browse</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal hidden" href="#">Post a listing</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal hidden" href="#">Help</a>
            </div>
            <div className="ml-[40vw] sm:ml-[60vw] md:ml-[70vw]">
            <Link to="/login">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#292929] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Log in</span>
            </button>
            </Link></div>
          </div>
        </header>
        <div className="px-16 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1160px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] rounded-xl flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/dc073f83-84e9-4ad1-8901-b24088d93d40.png")'
                  }}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      Welcome to SwapIt
                    </h1>
                    <h2 className="text-white text-md font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      A marketplace made for college students. Buy, sell, and trade with people you know
                    </h2>
                  </div>
                  <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                    <Link to="/signup">
                      <button
                            class="flex min-w-[84px] max-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                        >
                            <span class="truncate">Get started</span>
                        </button></Link>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-[#FFFFFF] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                >
                  Why SwapIt?
                </h1>
                <p className="text-[#FFFFFF] text-base font-normal leading-normal max-w-[720px]">
                  SwapIt is the easiest way to buy, sell, and trade with other college students. Here are a few reasons why you'll love it.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/81112fe1-23d0-4322-97f7-7e420106535d.png")'
                      }}
                  ></div>
                  <div>
                    <p className="text-[#FFFFFF] text-base font-medium leading-normal">Built for college students</p>
                    <p className="text-[#C4C4C4] text-sm font-normal leading-normal">Get exclusive deals and offers from the brands you love.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/a279e299-fffe-4469-a2a5-c5c88f5ae60d.png")'
                      }}
                  ></div>
                  <div>
                    <p className="text-[#FFFFFF] text-base font-medium leading-normal">List an item in minutes</p>
                    <p className="text-[#C4C4C4] text-sm font-normal leading-normal">Snap a photo, add a description, and set a price. It's that easy.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/3a7ab754-21ec-4f51-9a45-e375a7528ad6.png")'
                      }}></div>
                  <div>
                    <p className="text-[#FFFFFF] text-base font-medium leading-normal">Verified by our community</p>
                    <p className="text-[#C4C4C4] text-sm font-normal leading-normal">Know that you're buying from another student. We verify every profile.</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-[#FFFFFF] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured categories</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/7e631aa4-abfa-48d5-a209-6e68a02e7cb5.png")'
                  }} ></div>
                <p className="text-[#FFFFFF] text-base font-medium leading-normal">Textbooks</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/d8cea2bc-0a8b-47ab-aea3-476742d349ff.png")'
                  }}
                ></div>
                <p className="text-[#FFFFFF] text-base font-medium leading-normal">Electronics</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/406afc34-bd32-4598-bb10-63cc70468ac0.png")'
                  }}  ></div>
                <p className="text-[#FFFFFF] text-base font-medium leading-normal">Furniture</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/859dfa4a-2940-4c40-bb93-c86152374691.png")'
                  }} ></div>
                <p className="text-[#FFFFFF] text-base font-medium leading-normal">Apparel</p>
              </div>
            </div>
            <h2 className="text-[#FFFFFF] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Get started with SwapIt</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-1 gap-3 rounded-lg border border-[#383838] bg-[#242424] p-4 flex-col">
                <div className="text-[#FFFFFF]" data-icon="Camera" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                        d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"                    ></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#FFFFFF] text-base font-bold leading-tight">Snap a photo</h2>
                  <p className="text-[#C4C4C4] text-sm font-normal leading-normal">Take a picture of your item and add a description</p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#383838] bg-[#242424] p-4 flex-col">
                <div className="text-[#FFFFFF]" data-icon="List" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#FFFFFF] text-base font-bold leading-tight">List in seconds</h2>
                  <p className="text-[#C4C4C4] text-sm font-normal leading-normal">Set a price and list your item in under a minute</p>
                </div>
              </div>
              <div className="flex flex-1 gap-3 rounded-lg border border-[#383838] bg-[#242424] p-4 flex-col">
                <div className="text-[#FFFFFF]" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#FFFFFF] text-base font-bold leading-tight">Find what you need</h2>
                  <p className="text-[#C4C4C4] text-sm font-normal leading-normal">Shop for textbooks, electronics, furniture, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">About</a>
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">Blog</a>
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">Careers</a>
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">Contact</a>
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">Help</a>
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">Download iOS app</a>
                <a className="text-[#C4C4C4] text-base font-normal leading-normal min-w-40" href="#">Download Android app</a>
              </div>
              <p className="text-[#C4C4C4] text-base font-normal leading-normal">@2022 SwapIt</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
    );

}

export default HomePage;
