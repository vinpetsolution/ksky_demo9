"use client"
import { cn } from '@/utils/classNames'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { useModal } from "@/contexts/ModalContext"
import { useAuth } from "@/contexts/AuthContext"
import { LuLogIn, LuLogOut, LuMenu, LuX } from 'react-icons/lu'
import { useState, useCallback, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useDesktopMenu } from '@/contexts/DesktopMenuContext'
import { formatNumber } from '@/utils/format'
import { MdCloudDownload, MdCloudUpload, MdSync } from 'react-icons/md'
import { FaBullhorn, FaUser } from 'react-icons/fa'
import { BsClockHistory } from 'react-icons/bs'
import { TbArrowsExchange } from 'react-icons/tb'
import { AnimatePresence, motion } from '@/lib/motion'
import { HiChatBubbleOvalLeftEllipsis, HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2'

type SyncModalPhase = "syncing" | "done" | "error" | null;

function subscribeToClient() {
  return () => { };
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

const Header = () => {
  const { openProtectedModal, openModal, isAuthenticated } = useModal()
  const { user, logout, refreshUserProfile } = useAuth()
  const { isDesktopMenuOpen, toggleDesktopMenu, closeDesktopMenu } = useDesktopMenu()
  const [isOpen, setIsOpen] = useState(false)
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [syncModalPhase, setSyncModalPhase] = useState<SyncModalPhase>(null)
  const [syncModalMessage, setSyncModalMessage] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const isDesktopMenuPortalReady = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot
  )
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // useEffect(() => {
  //   if (!isOpen) return
  //   const prev = document.body.style.overflow
  //   document.body.style.overflow = "hidden"
  //   return () => {
  //     document.body.style.overflow = prev
  //   }
  // }, [isOpen])

  const handleSyncBalance = useCallback(async () => {
    if (!user?.userName || isSyncing) return;

    setShowSyncModal(true);
    setSyncModalPhase("syncing");
    setSyncModalMessage("동기화중...");
    setIsSyncing(true);

    await new Promise((resolve) => setTimeout(resolve, 600));
    setSyncModalPhase("done");
    setSyncModalMessage("완료");
    await refreshUserProfile();
    setIsSyncing(false);
  }, [user?.userName, isSyncing, refreshUserProfile]);

  const closeSyncModal = useCallback(() => {
    if (isSyncing) return;
    setShowSyncModal(false);
    setSyncModalPhase(null);
    setSyncModalMessage("");
  }, [isSyncing]);

  const handleLogout = useCallback(() => {
    logout()
    setIsOpen(false)
  }, [logout])

  const closeSidebar = useCallback(() => setIsOpen(false), [])

  const runSidebarAction = useCallback(
    (action: () => void) => {
      closeSidebar()
      action()
    },
    [closeSidebar]
  )

  return (
    <>
      <header className={cn("z-50",
        isScrolled ? "bg-white opacity-100 backdrop-blur-md shadow-[0_4px_16px_rgba(140,106,32,0.12)]" : "bg-white/92 backdrop-blur-sm lg:bg-white/45",
        "border-b border-gold-line/80 w-full lg:min-h-15.5",
        "fixed left-0 right-0 top-0 min-h-15.5 flex items-center",
        isScrolled && "after:content-[''] after:absolute after:inset-1 after:bg-white after:rounded-[50%] after:size-31 after:top-[-60%] after:left-1/2 after:-translate-x-1/2"
      )}>
        <nav className="relative min-h-15.5 mx-auto flex w-full items-center lg:gap-32 2xl:gap-44 px-4 md:px-6 lg:px-6">
          {/* Left — cột rộng bằng phải, nút dồn về phía logo */}
          <div className="lg:flex hidden min-h-15.5 min-w-0 flex-1 basis-0 items-center justify-end gap-1.5 2xl:gap-2">
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("deposit")}
              leftIcon={<MdCloudDownload className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              충전
            </Button>
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("withdraw")}
              leftIcon={<MdCloudUpload className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              출금
            </Button>
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("messages")}
              leftIcon={<HiOutlineChatBubbleOvalLeft className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              쪽지
            </Button>
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("bethistory")}
              leftIcon={<BsClockHistory className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              베팅내역
            </Button>
          </div>
          <div className='lg:hidden'>
            <Button
              type="button"
              variant="transparent"
              onClick={() => setIsOpen(!isOpen)}
              className={cn("text-sm h-auto! p-0 whitespace-nowrap text-ink",
                " hover:text-gold-deep "
              )}
            >
              <LuMenu className='size-8 shrink-0' />
            </Button>
          </div>
          <Link
            href="/"
            className={cn(
              "absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center bg-transparent",
              "transition-all duration-300",
              isScrolled
                ? "size-21 top-0 lg:top-0 lg:translate-y-0 "
                : "top-1/2 -translate-y-1/2 lg:translate-y-0 lg:top-0 size-20 2xl:size-37.5"
            )}
          >
            <Image src="/images/logo/ksky1.png"
              alt="KSKY SOLUTION"
              width={365}
              height={258}
              className="aspect-365/258 object-contain"
            />
          </Link>
          {/* Right — cột rộng bằng trái; auth vẫn absolute right trong cột này */}
          <div className="relative hidden lg:flex min-h-15.5 min-w-0 flex-1 basis-0 items-center justify-start gap-1.5 2xl:gap-2">
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("info")}
              leftIcon={<FaUser className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              내정보
            </Button>
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("support")}
              leftIcon={<HiChatBubbleOvalLeftEllipsis className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              문의
            </Button>
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("notice")}
              leftIcon={<FaBullhorn className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              공지
            </Button>
            <Button
              type="button"
              variant="transparent"
              onClick={() => openProtectedModal("convert")}
              leftIcon={<TbArrowsExchange className='size-4 shrink-0' />}
              className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
              )}
            >
              전환
            </Button>
          </div>

          <div className={cn("absolute right-4  ",
            isAuthenticated && user ? "lg:flex-col items-end gap-0 flex" : "hidden lg:flex lg:flex-row items-center gap-1.5 2xl:gap-2"
          )}>
            {isAuthenticated && user ? (
              <>
                <div className='2xl:flex hidden items-center gap-2 text-ink text-sm'>
                  <div className='flex items-center gap-1 '>
                    <span className='text-gold-deep font-bold'>{user?.userName || ''}</span>
                    님 환영합니다.
                  </div>
                  <div className='flex items-center gap-1 text-muted'>
                    <span>보유머니 :</span>
                    <span>
                      <strong className='text-gold-deep'>
                        {formatNumber(user?.balanceMoney || 0)}
                      </strong>
                      원
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncBalance}
                    disabled={isSyncing}
                    className={cn(
                      "flex items-center gap-1 rounded-full border border-gold px-2.5 py-0.5 text-xs text-gold-deep transition-colors",
                      "hover:bg-gold/10",
                      isSyncing && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <MdSync className={cn("size-3.5 shrink-0", isSyncing && "animate-spin")} />
                    동기화
                  </button>
                </div>
                <Button
                  variant='transparent'
                  className='text-sm h-auto! py-1.5 px-2 lg:px-4 whitespace-nowrap text-gold-deep hover:text-gold'
                  rightIcon={<LuLogOut className='size-3.5 shrink-0' />}
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="transparent"
                  onClick={() => openModal("register")}
                  className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                    "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
                  )}
                >
                  가입
                </Button>
                <Button
                  type="button"
                  variant="transparent"
                  onClick={() => openModal("login")}
                  className={cn("text-sm h-auto! py-1.5 px-4 rounded-full whitespace-nowrap text-ink",
                    "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
                  )}
                >
                  로그인
                </Button>

              </>
            )}
          </div>
          {isAuthenticated && user && (
            <div className={cn("flex 2xl:hidden items-center gap-1.5 2xl:gap-2 text-ink text-sm",
              "absolute right-4 bg-white border border-gold-line shadow-md translate-y-full backdrop-blur-sm rounded-lg p-2 transition-all duration-300",
              isScrolled ? "bottom-0 opacity-0" : "opacity-100 -bottom-2"
            )}>
              <div className='flex items-center gap-1 '>
                <span className='text-gold-deep font-bold'>{user?.userName || ''}</span>
                님 환영합니다.
              </div>
              <div className='flex items-center gap-1 text-muted'>
                <span>보유머니 :</span>
                <span className=''><strong className='text-gold-deep'>{formatNumber(user?.balanceMoney || 0)}</strong>원</span>
              </div>
              <button
                type="button"
                onClick={handleSyncBalance}
                disabled={isSyncing}
                className={cn(
                  "flex items-center gap-1 rounded-full border border-gold px-2 py-0.5 text-xs text-gold-deep transition-colors",
                  "hover:bg-gold/10",
                  isSyncing && "cursor-not-allowed opacity-50"
                )}
              >
                <MdSync className={cn("size-3 shrink-0", isSyncing && "animate-spin")} />
                동기화
              </button>
            </div>
          )}
        </nav>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              key="sidebar-backdrop"
              className="fixed inset-0 z-300 bg-black/45 lg:hidden"
              role="presentation"
              aria-hidden={true}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeSidebar}
            />
            <motion.aside
              key="sidebar-panel"
              role="dialog"
              aria-modal="true"
              aria-label="모바일 메뉴"
              className={cn(
                "fixed inset-y-0 left-0 z-300 flex h-full w-full flex-col shadow-[8px_0_24px_rgba(0,0,0,0.35)] lg:hidden",
                "bg-[linear-gradient(180deg,#FFFEFB_0%,#FDF9F2_100%)] border-r border-gold-line"
              )}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 p-8 relative items-start w-full h-full">
                <Button
                  type="button"
                  variant="transparent"
                  className="h-auto absolute top-3 left-3 p-2 text-ink hover:text-gold-deep/85"
                  aria-label="메뉴 닫기"
                  onClick={closeSidebar}
                >
                  <LuX className="size-7 shrink-0" />
                </Button>
                <div className="flex flex-col gap-4 items-center w-full h-full">
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        href="/"
                        onClick={closeSidebar}
                        className={cn("text-sm h-auto! py-4 px-10 rounded-full whitespace-nowrap text-ink",
                          "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
                        )}
                      >
                        홈으로
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="transparent"
                        onClick={() => runSidebarAction(() => openModal("register"))}
                        className={cn("text-sm h-auto! py-4 px-10 rounded-full whitespace-nowrap text-ink",
                          "hover:bg-gold hover:text-ink hover:border-gold border border-gold"
                        )}
                      >
                        가입
                      </Button>
                    </>
                  )}
                  <div className='flex flex-col w-full gap-2'>
                    {isAuthenticated && user ? (
                      <>
                        <Button
                          type="button"
                          variant="transparent"
                          leftIcon={<LuLogOut className='size-5 shrink-0' />}
                          onClick={handleLogout}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          로그아웃
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("info"))}
                          leftIcon={<FaUser className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          내정보
                        </Button>

                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("deposit"))}
                          leftIcon={<MdCloudDownload className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          충전
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("withdraw"))}
                          leftIcon={<MdCloudUpload className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          출금
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("support"))}
                          leftIcon={<HiChatBubbleOvalLeftEllipsis className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          1:1 문의
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("messages"))}
                          leftIcon={<HiOutlineChatBubbleOvalLeft className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          쪽지
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("notice"))}
                          leftIcon={<FaBullhorn className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          공지
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("bethistory"))}
                          leftIcon={<BsClockHistory className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          베팅내역
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          onClick={() => runSidebarAction(() => openProtectedModal("convert"))}
                          leftIcon={<TbArrowsExchange className='size-5 shrink-0' />}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          전환
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="transparent"
                          leftIcon={<LuLogIn className='size-5 shrink-0' />}
                          onClick={() => runSidebarAction(() => openModal("login"))}
                          className={cn("text-base h-auto! justify-start text-left py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          로그인
                        </Button>
                        <Button
                          type="button"
                          variant="transparent"
                          leftIcon={<FaBullhorn className='size-5 shrink-0' />}
                          onClick={() => runSidebarAction(() => openProtectedModal("notice"))}
                          className={cn("text-base h-auto! justify-start py-2.5 px-4 whitespace-nowrap text-ink",
                            " hover:text-gold-deep "
                          )}
                        >
                          공지
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      {/* XT Balance Sync Modal */}
      <AnimatePresence>
        {showSyncModal && (
          <motion.div
            key="sync-modal-backdrop"
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSyncModal}
          >
            <motion.div
              className="relative mx-4 w-full max-w-sm rounded-2xl border border-gold-line bg-white p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-center text-lg font-bold text-ink">잔액 동기화</h3>
              <p
                className={cn(
                  "text-center text-base font-semibold",
                  syncModalPhase === "done" && "text-emerald-400",
                  syncModalPhase === "error" && "text-red-400",
                  syncModalPhase === "syncing" && "text-gold-deep"
                )}
              >
                {syncModalPhase === "syncing" && (
                  <MdSync className="mr-1.5 inline-block size-5 animate-spin align-text-bottom" />
                )}
                {syncModalMessage}
              </p>
              {syncModalPhase !== "syncing" && (
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="transparent"
                    onClick={closeSyncModal}
                    className={cn(
                      "h-auto! rounded-full border border-gold px-8 py-2 text-sm text-ink",
                      "hover:bg-gold/15"
                    )}
                  >
                    확인
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isDesktopMenuPortalReady
        ? createPortal(
          <>
            {/* Cố định theo viewport — không bị đẩy theo layout; mở menu → burger thành X */}
            <div
              className="pointer-events-none fixed top-0 left-0 z-75 hidden h-15.5 w-full lg:block"
              data-desktop-menu-trigger
            >
              <div className="pointer-events-auto absolute top-1/2 left-3 -translate-y-1/2">
                <Button
                  type="button"
                  variant="transparent"
                  onClick={toggleDesktopMenu}
                  aria-expanded={isDesktopMenuOpen}
                  aria-label={isDesktopMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                  aria-controls="desktop-menu-panel"
                  className={cn(
                    "text-sm h-auto! p-1 text-ink drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
                    "hover:text-gold-deep"
                  )}
                >
                  {isDesktopMenuOpen ? (
                    <LuX className="size-8 shrink-0" aria-hidden />
                  ) : (
                    <LuMenu className="size-8 shrink-0" aria-hidden />
                  )}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {isDesktopMenuOpen ? (
                <>
                  <motion.div
                    key="desktop-menu-backdrop"
                    className="fixed inset-0 z-55 hidden bg-black/45 lg:block"
                    role="presentation"
                    aria-hidden={true}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={closeDesktopMenu}
                  />
                  <motion.aside
                    id="desktop-menu-panel"
                    key="desktop-menu-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="데스크톱 메뉴"
                    className={cn(
                      "fixed inset-y-0 left-0 z-60 hidden h-full w-75 flex-col overflow-y-auto shadow-[8px_0_24px_rgba(0,0,0,0.35)] lg:flex",
                      "bg-[linear-gradient(180deg,#FFFEFB_0%,#FDF9F2_100%)] border-r border-gold-line"
                    )}
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative flex h-full w-full shrink-0 flex-col items-start p-8 pt-10">
                      <div className="flex h-full w-full flex-col items-center gap-4">
                        {isAuthenticated && user ? (
                          <>
                            <Link
                              href="/"
                              className={cn(
                                "h-auto! whitespace-nowrap rounded-full border border-gold px-10 py-4 text-sm text-ink",
                                "hover:border-gold hover:bg-gold hover:text-ink"
                              )}
                            >
                              홈으로
                            </Link>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="transparent"
                              onClick={() => openModal("register")}
                              className={cn(
                                "h-auto! whitespace-nowrap rounded-full border border-gold px-10 py-4 text-sm text-ink",
                                "hover:border-gold hover:bg-gold hover:text-ink"
                              )}
                            >
                              가입
                            </Button>
                          </>
                        )}
                        <div className="flex w-full flex-col gap-2">
                          {isAuthenticated && user ? (
                            <>
                              <Button
                                type="button"
                                variant="transparent"
                                leftIcon={<LuLogOut className="size-5 shrink-0" />}
                                onClick={handleLogout}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                로그아웃
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("info")}
                                leftIcon={<FaUser className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                내정보
                              </Button>

                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("deposit")}
                                leftIcon={<MdCloudDownload className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                충전
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("withdraw")}
                                leftIcon={<MdCloudUpload className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                출금
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("support")}
                                leftIcon={<HiChatBubbleOvalLeftEllipsis className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                1:1 문의
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("messages")}
                                leftIcon={<HiOutlineChatBubbleOvalLeft className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                쪽지
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("notice")}
                                leftIcon={<FaBullhorn className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                공지
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("bethistory")}
                                leftIcon={<BsClockHistory className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                베팅내역
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                onClick={() => openProtectedModal("convert")}
                                leftIcon={<TbArrowsExchange className="size-5 shrink-0" />}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                전환
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                type="button"
                                variant="transparent"
                                leftIcon={<LuLogIn className="size-5 shrink-0" />}
                                onClick={() => openModal("login")}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-left text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                로그인
                              </Button>
                              <Button
                                type="button"
                                variant="transparent"
                                leftIcon={<FaBullhorn className="size-5 shrink-0" />}
                                onClick={() => openProtectedModal("notice")}
                                className={cn(
                                  "h-auto! justify-start whitespace-nowrap px-4 py-2.5 text-base text-ink",
                                  " hover:text-gold-deep "
                                )}
                              >
                                공지
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.aside>
                </>
              ) : null}
            </AnimatePresence>
          </>,
          document.body
        )
        : null}
    </>
  )
}

export default Header