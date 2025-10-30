"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";

export function Navbar() {
	const pathname = usePathname();
	const { address } = useAccount();

	// Check if current user is admin/owner
	const { data: owner } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "owner" as const
	});

	const isAdmin =
		address &&
		owner &&
		address.toLowerCase() === (owner as string).toLowerCase();

	const links = [
		{ href: "/", label: "Markets" },
		{ href: "/create", label: "Create Market" },
		{ href: "/positions", label: "My Positions" },
		...(isAdmin ? [{ href: "/admin", label: "Admin" }] : [])
	];

	return (
		<nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<Link href="/" className="flex items-center space-x-2">
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
							>
								🎯 Trenches
							</motion.div>
						</Link>

						<div className="hidden md:flex space-x-1">
							{links.map((link) => (
								<Link key={link.href} href={link.href}>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className={`px-4 py-2 rounded-lg transition-colors ${
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
					</div>

					<ConnectButton />
				</div>
			</div>
		</nav>
	);
}
