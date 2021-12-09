import { useState, useEffect, useRef } from 'react';
import {
  Bodies, Body, Composite, Engine, Events, Render, Runner, World,
} from 'matter-js';
import catImage from './images/submarine.png';
import waterImage from './images/water.png';
import _ from 'lodash';
import './App.css';

function App() {
  const scene = useRef(null);
  const engine = useRef(Engine.create());
  const player = useRef(Body.create({}));
  const [isStart, setIsStart] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [score, setScore] = useState(0)

  useEffect(() => {
    // mount
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;

    const currentEngine = engine.current;

    let elem: HTMLElement = document.body;
    if (scene.current) {
      elem = scene.current;
    } else {
      return () => { };
    }
    const render = Render.create({
        element: elem,
        engine: currentEngine,
        options: {
            width: clientWidth,
            height: clientHeight,
            background: waterImage,
            wireframes: false,
        }
    });

    // boundaries
    Composite.add(currentEngine.world, [
      // bottom
      Bodies.rectangle(clientWidth / 2, clientHeight , clientWidth * 2,20, {
        isStatic: true,
        render: {
          fillStyle: 'transparent'
        }
      })
    ]);
    player.current = Bodies.rectangle(
      clientWidth / 2,
      clientHeight / 2,
      10,
      20,
      {
        render: {
          fillStyle: 'white',
          sprite: {
            texture: catImage,
            xScale: 0.05,
            yScale: 0.05,
          }
        },
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
      }
    );


    Render.run(render);

    Composite.add(currentEngine.world, [player.current as Body]);

    const obstacles: Array<Body> = [];
    const map: Array<number> = [clientHeight - 25];

    const gameloop = setInterval(() => {
      const index: number = Math.floor(Math.random() * map.length);
      const box = Bodies.rectangle(
        clientWidth + 100,
        map[index]
        , 100, 25, {
        isStatic: true,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        render: {
          lineWidth: 0
        }
      });
      obstacles.push(box);
      Body.setVelocity(box, { x: -100, y: 0 });
      Composite.add(currentEngine.world, [box])

      Body.setVelocity(player.current, { x: player.current.velocity.x / 10, y: player.current.velocity.y })
      if (player.current.position.x < 0) {
        setIsStart(false);
        setIsDead(true);
      }
    }, 700);

    const gameloopPlayer = setInterval(() => {
      if (player.current.position.x < clientWidth * 0.45) {
        Body.setVelocity(player.current, { x: 1, y: player.current.velocity.y });
      } else if (player.current.position.x > clientWidth * 0.85) {
        Body.setVelocity(player.current, { x: -0.25, y: player.current.velocity.y });
      }
    }, 100);

    if (!isStart) {
      clearInterval(gameloop);
      clearInterval(gameloopPlayer);
    }

    Events.on(currentEngine, 'beforeUpdate', () => {
      for (let i of obstacles) {
        if (i.position.x < -50) {
          Composite.remove(currentEngine.world, i);
        } else {
          Body.setVelocity(i, { x: -1, y: 0 })
          Body.setPosition(i, { x: i.position.x - 1, y: i.position.y });
        }
      }
      while (obstacles.length > 0 && obstacles[0].position.x < -50) {
        obstacles.splice(0, 1);
      }
      Body.setAngularVelocity(player.current, 0);
    });

    // unmount
    return () => {
      // destroy Matter
      Render.stop(render);
      Engine.clear(currentEngine);
      World.clear(currentEngine.world, false);
      Composite.clear(currentEngine.world, false);
      render.canvas.remove();
      render.textures = {};
      clearInterval(gameloop);
    }
  }, [isStart]);

  useEffect(() => {
    let id: any;
    if (isStart) {
      id = setInterval(() => {
        setScore(score => { return score + 1 });
      }, 1000);
    }

    return () => { clearInterval(id) }
  }, [isStart])

  const wait = 500;
  const handleTinyDown = _.throttle((e: { clientX: number; clientY: number; }) => {
    const p = player.current;
    Body.applyForce(p, { x: p.position.x, y: p.position.y }, { x: 0, y: -0.006 });
  }, wait)

  const handleStrongDown = _.throttle((e: { clientX: number; clientY: number; }) => {
    const p = player.current;
    Body.applyForce(p, { x: p.position.x, y: p.position.y }, { x: 0, y: -0.008 });
  }, wait)

  return (
    <div className="App">
      <div className="score">{score}</div>
      <div
        className="playground"
        ref={scene}
      />
      <div
        className="control"
      >
        {isStart ?
          <>
            <div
              className="btn"
              onMouseDown={handleTinyDown}
            >Jump</div>
            <div
              className="btn"
              onMouseDown={handleStrongDown}
            >Jump Jump</div>
          </>
          :
          <>
            {isDead ?
              <div className="deadLogo">You Dead</div>
              :
              <div className="btn"
                onClick={() => {
                  // run the engine
                  Runner.run(engine.current);

                  setIsStart(true);
                }}
              >Start</div>}
          </>}
      </div>
    </div >
  );
}

export default App;
