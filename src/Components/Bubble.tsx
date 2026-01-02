import React from "react";

interface BubbleProps {
	text: string;
}

export default function Bubble(props: BubbleProps) {
	return (
		<div className={"text-orange-100 py-2 px-4 rounded bg-stone-800"}>
			{props.text}
		</div>
	)
}