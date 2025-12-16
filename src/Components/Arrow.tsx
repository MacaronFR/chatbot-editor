import {useMemo, useRef} from "react";

interface ArrowProps {
	from: {x: number, y: number},
	to: {x: number, y: number}
}

export default function Arrow(props: ArrowProps) {
	const ref = useRef<SVGSVGElement>(null);
	const [width, height] = useMemo(() => [
		Math.abs(props.from.x - props.to.x) + (props.from.x + 20 <= props.to.x - 20 ? 0 : 40),
		Math.abs(props.from.y - props.to.y)
	], [props.from, props.to]);
	const [start] = useMemo(() => [
		{x: props.from.x + 20 < props.to.x - 20 ? 0 : -20, y: 0}
	], [props.from, props.to]);
	const [left, top] = useMemo(() =>
		[
			props.from.x + 20 <= props.to.x - 20 ? props.from.x : props.to.x - 20,
			props.from.y < props.to.y ? props.from.y : props.to.y
		],
		[props.from, props.to]
	);
	const [from, to] = useMemo(() => [
		{x: props.from.x + 20 < props.to.x - 20 ? 0 : (props.from.x < props.to.x ? (props.from.x === props.to.x ? 0 : -20) : width - 40), y: props.from.y < props.to.y ? 0 : height},
		{x: props.from.x + 20 < props.to.x - 20 ? width : (props.from.x + 20 === props.to.x - 20 ? 20 : 0), y: props.from.y < props.to.y ? height : 0},
	], [props.from, props.to, width, height]);
	const path = useMemo(() => {
		let p = `M${from.x} ${from.y}  L${from.x + 16} ${from.y}`;
		if(from.x + 20 < to.x - 20) {
			if(from.y < to.y) {
				p += ` L${(to.x - from.x) / 2 - 4} ${from.y} Q${(to.x - from.x) / 2 - 4} ${from.y} ${(to.x - from.x) / 2} ${from.y + 4} L${(to.x - from.x) / 2} ${to.y - 4} Q${(to.x - from.x) / 2} ${to.y - 4} ${(to.x - from.x) / 2 + 4} ${to.y}`;
			} else if(from.y > to.y) {
				p += ` L${(to.x - from.x) / 2 - 4} ${from.y} Q${(to.x - from.x) / 2 - 4} ${from.y} ${(to.x - from.x) / 2} ${from.y - 4} L${(to.x - from.x) / 2} ${to.y + 4} Q${(to.x - from.x) / 2} ${to.y + 4} ${(to.x - from.x) / 2 + 4} ${to.y}`;
			}
		} else if(from.x + 20 > to.x - 20) {
			if(from.y < to.y) {
				p += ` Q${from.x + 16} ${from.y} ${from.x + 20} ${from.y + 4} L${from.x + 20} ${to.y - 44} Q${from.x + 20} ${to.y - 44} ${from.x + 16} ${to.y - 40} L${to.x-16} ${to.y - 40} Q${to.x-16} ${to.y - 40} ${to.x-20} ${to.y - 36}`;
				p += ` L${to.x - 20} ${to.y - 4} Q${to.x - 20} ${to.y - 4} ${to.x - 16} ${to.y}`;
			} else if(from.y > to.y) {
				p += ` Q${from.x + 16} ${from.y} ${from.x + 20} ${from.y - 4} L${from.x + 20} ${from.y - 36} Q${from.x + 20} ${from.y - 36} ${from.x + 16} ${from.y -40} L${to.x-16} ${from.y - 40} Q${to.x-16} ${from.y - 40} ${to.x-20} ${from.y - 44}`;
				p += ` L${to.x - 20} ${to.y + 4} Q${to.x - 20} ${to.y + 4} ${to.x - 16} ${to.y}`;
			}
		} else {
			if(from.y < to.y) {
				p += ` Q${from.x + 16} ${from.y} ${from.x + 20} ${from.y + 4} L${from.x + 20} ${to.y - 4} Q${from.x + 20} ${to.y - 4} ${from.x + 24} ${to.y}`;
			} else if(from.y > to.y) {
				p += ` Q${from.x + 16} ${from.y} ${from.x + 20} ${from.y - 4} L${from.x + 20} ${to.y + 4} Q${from.x + 20} ${to.y + 4} ${from.x + 24} ${to.y}`;
			}
		}
		p += ` L${to.x} ${to.y}`
		return p;
	}, [from, to]);
	return (
		<svg ref={ref} viewBox={`${start.x} ${start.y} ${width} ${height}`} width={width} height={height} className={"absolute -z-20 stroke-stone-600 pointer-events-none"} style={{left: left, top: top}}>
			<path d={path} fill={"none"} strokeWidth={"2"}/>
		</svg>
	)
}