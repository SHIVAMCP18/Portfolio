== initial TAC (59 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = HIST $close, 0              ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = HIST $close, 0              ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = HIST $close, 0             ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t15 = CONST 0.05                 ; scalar
 17   t16 = NEG t15                    ; scalar
 18   t17 = CONST 0.05                 ; scalar
 19   t18 = CLAMP t6, t16, t17         ; scalar
 20   t19 = CONST 0.05                 ; scalar
 21   t20 = NEG t19                    ; scalar
 22   t21 = CONST 0.05                 ; scalar
 23   t22 = CLAMP t10, t20, t21        ; scalar
 24   t23 = ADD t18, t22               ; scalar
 25   t24 = CONST 0.05                 ; scalar
 26   t25 = NEG t24                    ; scalar
 27   t26 = CONST 0.05                 ; scalar
 28   t27 = CLAMP t14, t25, t26        ; scalar
 29   t28 = ADD t23, t27               ; scalar
 30   t29 = CONST 0.03                 ; scalar
 31   t30 = GT t28, t29                ; bool
 32   JZ t30, L2
 33   t32 = SLOAD @pos                 ; volume
 34   t33 = CONST 0.0                  ; volume
 35   t34 = EQ t32, t33                ; bool
 36   t31 = COPY t34                   ; bool
 37   JMP L3
 38 L2:
 39   t31 = CONST 0.0                  ; bool
 40 L3:
 41   JZ t31, L4
 42   t35 = CONST 50.0                 ; volume
 43   BUY t35
 44   t36 = CONST 50.0                 ; volume
 45   SSTORE @pos, t36
 46 L4:
 47   t37 = CONST 0.03                 ; scalar
 48   t38 = NEG t37                    ; scalar
 49   t39 = LT t28, t38                ; bool
 50   JZ t39, L5
 51   t41 = SLOAD @pos                 ; volume
 52   t42 = CONST 0.0                  ; volume
 53   t43 = GT t41, t42                ; bool
 54   t40 = COPY t43                   ; bool
 55   JMP L6
 56 L5:
 57   t40 = CONST 0.0                  ; bool
 58 L6:
 59   JZ t40, L7
 60   FLATTEN
 61   t44 = CONST 0.0                  ; volume
 62   SSTORE @pos, t44
 63 L7:
 64 L1:
== after fold: 59 -> 59 instructions, 4 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = HIST $close, 0              ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = HIST $close, 0              ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = HIST $close, 0             ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t15 = CONST 0.05                 ; scalar
 17   t16 = CONST -0.05                ; scalar
 18   t17 = CONST 0.05                 ; scalar
 19   t18 = CLAMP t6, t16, t17         ; scalar
 20   t19 = CONST 0.05                 ; scalar
 21   t20 = CONST -0.05                ; scalar
 22   t21 = CONST 0.05                 ; scalar
 23   t22 = CLAMP t10, t20, t21        ; scalar
 24   t23 = ADD t18, t22               ; scalar
 25   t24 = CONST 0.05                 ; scalar
 26   t25 = CONST -0.05                ; scalar
 27   t26 = CONST 0.05                 ; scalar
 28   t27 = CLAMP t14, t25, t26        ; scalar
 29   t28 = ADD t23, t27               ; scalar
 30   t29 = CONST 0.03                 ; scalar
 31   t30 = GT t28, t29                ; bool
 32   JZ t30, L2
 33   t32 = SLOAD @pos                 ; volume
 34   t33 = CONST 0.0                  ; volume
 35   t34 = EQ t32, t33                ; bool
 36   t31 = COPY t34                   ; bool
 37   JMP L3
 38 L2:
 39   t31 = CONST 0.0                  ; bool
 40 L3:
 41   JZ t31, L4
 42   t35 = CONST 50.0                 ; volume
 43   BUY t35
 44   t36 = CONST 50.0                 ; volume
 45   SSTORE @pos, t36
 46 L4:
 47   t37 = CONST 0.03                 ; scalar
 48   t38 = CONST -0.03                ; scalar
 49   t39 = LT t28, t38                ; bool
 50   JZ t39, L5
 51   t41 = SLOAD @pos                 ; volume
 52   t42 = CONST 0.0                  ; volume
 53   t43 = GT t41, t42                ; bool
 54   t40 = COPY t43                   ; bool
 55   JMP L6
 56 L5:
 57   t40 = CONST 0.0                  ; bool
 58 L6:
 59   JZ t40, L7
 60   FLATTEN
 61   t44 = CONST 0.0                  ; volume
 62   SSTORE @pos, t44
 63 L7:
 64 L1:
== after algebraic: 59 -> 59 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = HIST $close, 0              ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = HIST $close, 0              ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = HIST $close, 0             ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t15 = CONST 0.05                 ; scalar
 17   t16 = CONST -0.05                ; scalar
 18   t17 = CONST 0.05                 ; scalar
 19   t18 = CLAMP t6, t16, t17         ; scalar
 20   t19 = CONST 0.05                 ; scalar
 21   t20 = CONST -0.05                ; scalar
 22   t21 = CONST 0.05                 ; scalar
 23   t22 = CLAMP t10, t20, t21        ; scalar
 24   t23 = ADD t18, t22               ; scalar
 25   t24 = CONST 0.05                 ; scalar
 26   t25 = CONST -0.05                ; scalar
 27   t26 = CONST 0.05                 ; scalar
 28   t27 = CLAMP t14, t25, t26        ; scalar
 29   t28 = ADD t23, t27               ; scalar
 30   t29 = CONST 0.03                 ; scalar
 31   t30 = GT t28, t29                ; bool
 32   JZ t30, L2
 33   t32 = SLOAD @pos                 ; volume
 34   t33 = CONST 0.0                  ; volume
 35   t34 = EQ t32, t33                ; bool
 36   t31 = COPY t34                   ; bool
 37   JMP L3
 38 L2:
 39   t31 = CONST 0.0                  ; bool
 40 L3:
 41   JZ t31, L4
 42   t35 = CONST 50.0                 ; volume
 43   BUY t35
 44   t36 = CONST 50.0                 ; volume
 45   SSTORE @pos, t36
 46 L4:
 47   t37 = CONST 0.03                 ; scalar
 48   t38 = CONST -0.03                ; scalar
 49   t39 = LT t28, t38                ; bool
 50   JZ t39, L5
 51   t41 = SLOAD @pos                 ; volume
 52   t42 = CONST 0.0                  ; volume
 53   t43 = GT t41, t42                ; bool
 54   t40 = COPY t43                   ; bool
 55   JMP L6
 56 L5:
 57   t40 = CONST 0.0                  ; bool
 58 L6:
 59   JZ t40, L7
 60   FLATTEN
 61   t44 = CONST 0.0                  ; volume
 62   SSTORE @pos, t44
 63 L7:
 64 L1:
== after propagate: 59 -> 59 instructions, 13 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = HIST $close, 0              ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = HIST $close, 0              ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = HIST $close, 0             ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t15 = CONST 0.05                 ; scalar
 17   t16 = CONST -0.05                ; scalar
 18   t17 = CONST 0.05                 ; scalar
 19   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 20   t19 = CONST 0.05                 ; scalar
 21   t20 = CONST -0.05                ; scalar
 22   t21 = CONST 0.05                 ; scalar
 23   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 24   t23 = ADD t18, t22               ; scalar
 25   t24 = CONST 0.05                 ; scalar
 26   t25 = CONST -0.05                ; scalar
 27   t26 = CONST 0.05                 ; scalar
 28   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 29   t28 = ADD t23, t27               ; scalar
 30   t29 = CONST 0.03                 ; scalar
 31   t30 = GT t28, 0.03               ; bool
 32   JZ t30, L2
 33   t32 = SLOAD @pos                 ; volume
 34   t33 = CONST 0.0                  ; volume
 35   t34 = EQ t32, 0.0                ; bool
 36   t31 = COPY t34                   ; bool
 37   JMP L3
 38 L2:
 39   t31 = CONST 0.0                  ; bool
 40 L3:
 41   JZ t31, L4
 42   t35 = CONST 50.0                 ; volume
 43   BUY 50.0
 44   t36 = CONST 50.0                 ; volume
 45   SSTORE @pos, 50.0
 46 L4:
 47   t37 = CONST 0.03                 ; scalar
 48   t38 = CONST -0.03                ; scalar
 49   t39 = LT t28, -0.03              ; bool
 50   JZ t39, L5
 51   t41 = SLOAD @pos                 ; volume
 52   t42 = CONST 0.0                  ; volume
 53   t43 = GT t41, 0.0                ; bool
 54   t40 = COPY t43                   ; bool
 55   JMP L6
 56 L5:
 57   t40 = CONST 0.0                  ; bool
 58 L6:
 59   JZ t40, L7
 60   FLATTEN
 61   t44 = CONST 0.0                  ; volume
 62   SSTORE @pos, 0.0
 63 L7:
 64 L1:
== after lvn-cse: 59 -> 59 instructions, 10 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = HIST $close, 0              ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t3                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t3                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t15 = CONST 0.05                 ; scalar
 17   t16 = CONST -0.05                ; scalar
 18   t17 = COPY t15                   ; scalar
 19   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 20   t19 = COPY t15                   ; scalar
 21   t20 = COPY t16                   ; scalar
 22   t21 = COPY t15                   ; scalar
 23   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 24   t23 = ADD t18, t22               ; scalar
 25   t24 = COPY t15                   ; scalar
 26   t25 = COPY t16                   ; scalar
 27   t26 = COPY t15                   ; scalar
 28   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 29   t28 = ADD t23, t27               ; scalar
 30   t29 = CONST 0.03                 ; scalar
 31   t30 = GT t28, 0.03               ; bool
 32   JZ t30, L2
 33   t32 = SLOAD @pos                 ; volume
 34   t33 = CONST 0.0                  ; volume
 35   t34 = EQ t32, 0.0                ; bool
 36   t31 = COPY t34                   ; bool
 37   JMP L3
 38 L2:
 39   t31 = CONST 0.0                  ; bool
 40 L3:
 41   JZ t31, L4
 42   t35 = CONST 50.0                 ; volume
 43   BUY 50.0
 44   t36 = COPY t35                   ; volume
 45   SSTORE @pos, 50.0
 46 L4:
 47   t37 = CONST 0.03                 ; scalar
 48   t38 = CONST -0.03                ; scalar
 49   t39 = LT t28, -0.03              ; bool
 50   JZ t39, L5
 51   t41 = SLOAD @pos                 ; volume
 52   t42 = CONST 0.0                  ; volume
 53   t43 = GT t41, 0.0                ; bool
 54   t40 = COPY t43                   ; bool
 55   JMP L6
 56 L5:
 57   t40 = CONST 0.0                  ; bool
 58 L6:
 59   JZ t40, L7
 60   FLATTEN
 61   t44 = CONST 0.0                  ; volume
 62   SSTORE @pos, 0.0
 63 L7:
 64 L1:
== after global-cse: 59 -> 59 instructions, 2 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t3                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t3                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t15 = CONST 0.05                 ; scalar
 17   t16 = CONST -0.05                ; scalar
 18   t17 = COPY t15                   ; scalar
 19   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 20   t19 = COPY t15                   ; scalar
 21   t20 = COPY t16                   ; scalar
 22   t21 = COPY t15                   ; scalar
 23   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 24   t23 = ADD t18, t22               ; scalar
 25   t24 = COPY t15                   ; scalar
 26   t25 = COPY t16                   ; scalar
 27   t26 = COPY t15                   ; scalar
 28   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 29   t28 = ADD t23, t27               ; scalar
 30   t29 = CONST 0.03                 ; scalar
 31   t30 = GT t28, 0.03               ; bool
 32   JZ t30, L2
 33   t32 = SLOAD @pos                 ; volume
 34   t33 = CONST 0.0                  ; volume
 35   t34 = EQ t32, 0.0                ; bool
 36   t31 = COPY t34                   ; bool
 37   JMP L3
 38 L2:
 39   t31 = CONST 0.0                  ; bool
 40 L3:
 41   JZ t31, L4
 42   t35 = CONST 50.0                 ; volume
 43   BUY 50.0
 44   t36 = COPY t35                   ; volume
 45   SSTORE @pos, 50.0
 46 L4:
 47   t37 = COPY t29                   ; scalar
 48   t38 = CONST -0.03                ; scalar
 49   t39 = LT t28, -0.03              ; bool
 50   JZ t39, L5
 51   t41 = SLOAD @pos                 ; volume
 52   t42 = CONST 0.0                  ; volume
 53   t43 = GT t41, 0.0                ; bool
 54   t40 = COPY t43                   ; bool
 55   JMP L6
 56 L5:
 57   t40 = CONST 0.0                  ; bool
 58 L6:
 59   JZ t40, L7
 60   FLATTEN
 61   t44 = CONST 0.0                  ; volume
 62   SSTORE @pos, 0.0
 63 L7:
 64 L1:
== after dce: 59 -> 42 instructions, 17 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t3                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t3                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after window-sr: 42 -> 42 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t3                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t3                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after peephole: 42 -> 42 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t3                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t3                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after fold#2: 42 -> 42 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t3, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t3                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t7, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t3                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t11, t12               ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after propagate#2: 42 -> 42 instructions, 5 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t1, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t1                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t1, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t1                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t1, t12                ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after lvn-cse#2: 42 -> 42 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t1, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t1                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t1, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t1                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t1, t12                ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after global-cse#2: 42 -> 42 instructions, 0 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t3 = COPY t1                     ; price
  5   t4 = HIST $close, 1              ; price
  6   t5 = SUB t1, t4                  ; price
  7   t6 = DIV t5, t4                  ; scalar
  8   t7 = COPY t1                     ; price
  9   t8 = HIST $close, 5              ; price
 10   t9 = SUB t1, t8                  ; price
 11   t10 = DIV t9, t8                 ; scalar
 12   t11 = COPY t1                    ; price
 13   t12 = HIST $close, 10            ; price
 14   t13 = SUB t1, t12                ; price
 15   t14 = DIV t13, t12               ; scalar
 16   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 17   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 18   t23 = ADD t18, t22               ; scalar
 19   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 20   t28 = ADD t23, t27               ; scalar
 21   t30 = GT t28, 0.03               ; bool
 22   JZ t30, L2
 23   t32 = SLOAD @pos                 ; volume
 24   t34 = EQ t32, 0.0                ; bool
 25   t31 = COPY t34                   ; bool
 26   JMP L3
 27 L2:
 28   t31 = CONST 0.0                  ; bool
 29 L3:
 30   JZ t31, L4
 31   BUY 50.0
 32   SSTORE @pos, 50.0
 33 L4:
 34   t39 = LT t28, -0.03              ; bool
 35   JZ t39, L5
 36   t41 = SLOAD @pos                 ; volume
 37   t43 = GT t41, 0.0                ; bool
 38   t40 = COPY t43                   ; bool
 39   JMP L6
 40 L5:
 41   t40 = CONST 0.0                  ; bool
 42 L6:
 43   JZ t40, L7
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L7:
 47 L1:
== after dce#2: 42 -> 39 instructions, 3 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t4 = HIST $close, 1              ; price
  5   t5 = SUB t1, t4                  ; price
  6   t6 = DIV t5, t4                  ; scalar
  7   t8 = HIST $close, 5              ; price
  8   t9 = SUB t1, t8                  ; price
  9   t10 = DIV t9, t8                 ; scalar
 10   t12 = HIST $close, 10            ; price
 11   t13 = SUB t1, t12                ; price
 12   t14 = DIV t13, t12               ; scalar
 13   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 14   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 15   t23 = ADD t18, t22               ; scalar
 16   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 17   t28 = ADD t23, t27               ; scalar
 18   t30 = GT t28, 0.03               ; bool
 19   JZ t30, L2
 20   t32 = SLOAD @pos                 ; volume
 21   t34 = EQ t32, 0.0                ; bool
 22   t31 = COPY t34                   ; bool
 23   JMP L3
 24 L2:
 25   t31 = CONST 0.0                  ; bool
 26 L3:
 27   JZ t31, L4
 28   BUY 50.0
 29   SSTORE @pos, 50.0
 30 L4:
 31   t39 = LT t28, -0.03              ; bool
 32   JZ t39, L5
 33   t41 = SLOAD @pos                 ; volume
 34   t43 = GT t41, 0.0                ; bool
 35   t40 = COPY t43                   ; bool
 36   JMP L6
 37 L5:
 38   t40 = CONST 0.0                  ; bool
 39 L6:
 40   JZ t40, L7
 41   FLATTEN
 42   SSTORE @pos, 0.0
 43 L7:
 44 L1:
== final TAC (39 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t2 = BARS_GT 10                  ; bool
  3   JZ t2, L1
  4   t4 = HIST $close, 1              ; price
  5   t5 = SUB t1, t4                  ; price
  6   t6 = DIV t5, t4                  ; scalar
  7   t8 = HIST $close, 5              ; price
  8   t9 = SUB t1, t8                  ; price
  9   t10 = DIV t9, t8                 ; scalar
 10   t12 = HIST $close, 10            ; price
 11   t13 = SUB t1, t12                ; price
 12   t14 = DIV t13, t12               ; scalar
 13   t18 = CLAMP t6, -0.05, 0.05      ; scalar
 14   t22 = CLAMP t10, -0.05, 0.05     ; scalar
 15   t23 = ADD t18, t22               ; scalar
 16   t27 = CLAMP t14, -0.05, 0.05     ; scalar
 17   t28 = ADD t23, t27               ; scalar
 18   t30 = GT t28, 0.03               ; bool
 19   JZ t30, L2
 20   t32 = SLOAD @pos                 ; volume
 21   t34 = EQ t32, 0.0                ; bool
 22   t31 = COPY t34                   ; bool
 23   JMP L3
 24 L2:
 25   t31 = CONST 0.0                  ; bool
 26 L3:
 27   JZ t31, L4
 28   BUY 50.0
 29   SSTORE @pos, 50.0
 30 L4:
 31   t39 = LT t28, -0.03              ; bool
 32   JZ t39, L5
 33   t41 = SLOAD @pos                 ; volume
 34   t43 = GT t41, 0.0                ; bool
 35   t40 = COPY t43                   ; bool
 36   JMP L6
 37 L5:
 38   t40 = CONST 0.0                  ; bool
 39 L6:
 40   JZ t40, L7
 41   FLATTEN
 42   SSTORE @pos, 0.0
 43 L7:
 44 L1:
