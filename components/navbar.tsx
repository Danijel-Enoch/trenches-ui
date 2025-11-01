"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";
import { useState } from "react";

export function Navbar() {
	const pathname = usePathname();
	const { address } = useAccount();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const links = [
		{ href: "/", label: "Markets" },
		{ href: "/create", label: "Create" },
		{ href: "/positions", label: "Positions" },
		{ href: "/simulation-demo", label: "Demo" },
		//{ href: "/subgraph", label: "Analytics" },
		{ href: "/admin", label: "Admin" }
	];

	return (
		<nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
							>
								🎯 Trenches
							</motion.div>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{links.map((link) => (
							<Link key={link.href} href={link.href}>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
										pathname === link.href
											? "bg-purple-600 text-white"
											: "text-zinc-400 hover:text-white hover:bg-zinc-800"
									} ${
										link.href === "/admin"
											? "border border-purple-500/50"
											: ""
									}`}
								>
									{link.label}
									{link.href === "/admin" && (
										<span className="ml-1 text-xs">👑</span>
									)}
								</motion.div>
							</Link>
						))}
					</div>

					{/* Right side - Connect Button + Mobile Menu */}
					<div className="flex items-center space-x-2">
						<div className="hidden sm:block">
							<ConnectButton />
						</div>
						<div className="sm:hidden">
							<ConnectButton
								showBalance={false}
								chainStatus="none"
								accountStatus="avatar"
							/>
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{mobileMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden border-t border-zinc-800 bg-black/80 backdrop-blur-xl"
						>
							<div className="px-2 pt-2 pb-3 space-y-1">
								{links.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setMobileMenuOpen(false)}
									>
										<motion.div
											whileTap={{ scale: 0.95 }}
											className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
												pathname === link.href
													? "bg-purple-600 text-white"
													: "text-zinc-400 hover:text-white hover:bg-zinc-800"
											} ${
												link.href === "/admin"
													? "border border-purple-500/50"
													: ""
											}`}
										>
											{link.label}
											{link.href === "/admin" && (
												<span className="ml-1 text-xs">
													👑
												</span>
											)}
										</motion.div>
									</Link>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</nav>
	);
}
