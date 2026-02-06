"use client";
import { motion } from "motion/react";

export default function Footer() {
	return (
        <div className="relative min-h-[300px] overflow-hidden">
        <motion.footer 
            className="absolute inset-0 w-full h-full overflow-hidden" 
                style={{ background: 'radial-gradient(125% 125% at 50% 0% , transparent 50%, #00ffbf, oklch(1 0 0) 90%)' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            >
        </motion.footer>
            <motion.div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/3 z-30"
                initial={{ opacity: 0, y: 0, filter:'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter:'blur(0px)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease:'easeOut'}}
                >
                <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-bold tracking-wider text-foreground/20 font-instrument-serif whitespace-nowrap">
                    CONTRIB
                </h1>
            </motion.div>
                </div>
	)
}
